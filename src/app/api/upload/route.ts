import { NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

// 配置项
const CONFIG = {
  // 最大单张图片大小（字节）
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  // 最大总存储大小（字节）
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB
  // 最大文件数量
  MAX_FILE_COUNT: 100,
  // 压缩后的最大宽度
  MAX_IMAGE_WIDTH: 1920,
  // 压缩后的最大高度
  MAX_IMAGE_HEIGHT: 1080,
  // 压缩质量 (0-100)
  JPEG_QUALITY: 85,
  WEBP_QUALITY: 80,
  // 上传目录
  UPLOAD_DIR: path.join(process.cwd(), 'public', 'uploads'),
}

// 支持的图片类型
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// 获取目录下所有文件的总大小和数量
async function getDirectoryStats(dir: string): Promise<{ totalSize: number; fileCount: number; files: string[] }> {
  try {
    const files = await readdir(dir)
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))

    let totalSize = 0
    const fileStats: Array<{ path: string; size: number; time: number }> = []

    for (const file of imageFiles) {
      const filePath = path.join(dir, file)
      const stats = await stat(filePath)
      totalSize += stats.size
      fileStats.push({
        path: filePath,
        size: stats.size,
        time: stats.mtimeMs,
      })
    }

    // 按修改时间排序（旧的在前）
    fileStats.sort((a, b) => a.time - b.time)

    return {
      totalSize,
      fileCount: imageFiles.length,
      files: fileStats.map(f => f.path),
    }
  } catch (error) {
    // 目录不存在时返回空
    return { totalSize: 0, fileCount: 0, files: [] }
  }
}

// 清理旧文件（FIFO 策略）
async function cleanupOldFiles(dir: string, requiredSize: number, requiredCount: number): Promise<void> {
  const stats = await getDirectoryStats(dir)
  const { totalSize, fileCount, files } = stats

  let newSize = totalSize
  let newCount = fileCount
  let deletedCount = 0

  for (const filePath of files) {
    if (newSize <= requiredSize && newCount <= requiredCount) {
      break
    }

    try {
      const fileStat = await stat(filePath)
      await unlink(filePath)
      newSize -= fileStat.size
      newCount--
      deletedCount++
    } catch (error) {
      console.error('Failed to delete file:', filePath, error)
    }
  }

  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} old files to make space`)
  }
}

// 压缩图片
async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  let image = sharp(buffer)
  const metadata = await image.metadata()

  // 调整尺寸（如果超过限制）
  let shouldResize = false
  let width = metadata.width
  let height = metadata.height

  if (width && width > CONFIG.MAX_IMAGE_WIDTH) {
    height = Math.round((CONFIG.MAX_IMAGE_WIDTH / width) * (height || CONFIG.MAX_IMAGE_HEIGHT))
    width = CONFIG.MAX_IMAGE_WIDTH
    shouldResize = true
  }

  if (height && height > CONFIG.MAX_IMAGE_HEIGHT) {
    width = Math.round((CONFIG.MAX_IMAGE_HEIGHT / height) * (width || CONFIG.MAX_IMAGE_WIDTH))
    height = CONFIG.MAX_IMAGE_HEIGHT
    shouldResize = true
  }

  if (shouldResize) {
    image = image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // 根据类型压缩
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return await image.jpeg({ quality: CONFIG.JPEG_QUALITY }).toBuffer()
  } else if (mimeType === 'image/png') {
    return await image.png({ quality: CONFIG.JPEG_QUALITY }).toBuffer()
  } else if (mimeType === 'image/webp') {
    return await image.webp({ quality: CONFIG.WEBP_QUALITY }).toBuffer()
  } else {
    return buffer // GIF 等其他格式不压缩
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: '没有选择文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '只支持上传图片文件 (JPEG, PNG, GIF, WebP)' },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `图片大小不能超过 ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // 确保上传目录存在
    try {
      await mkdir(CONFIG.UPLOAD_DIR, { recursive: true })
    } catch (error) {
      console.error('Failed to create upload directory:', error)
    }

    // 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)

    // 压缩图片
    try {
      buffer = await compressImage(buffer, file.type)
      console.log(`Image compressed: ${file.size} -> ${buffer.length} bytes`)
    } catch (error) {
      console.error('Image compression failed, using original:', error)
    }

    // 检查并清理旧文件
    const stats = await getDirectoryStats(CONFIG.UPLOAD_DIR)
    if (stats.totalSize + buffer.length > CONFIG.MAX_TOTAL_SIZE || stats.fileCount >= CONFIG.MAX_FILE_COUNT) {
      // 预留 10% 的空间
      const requiredSize = CONFIG.MAX_TOTAL_SIZE - buffer.length - Math.floor(CONFIG.MAX_TOTAL_SIZE * 0.1)
      const requiredCount = CONFIG.MAX_FILE_COUNT - 1

      await cleanupOldFiles(CONFIG.UPLOAD_DIR, requiredSize, requiredCount)
    }

    // 生成唯一文件名
    const ext = path.extname(file.name) || '.jpg'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}_${random}${ext}`
    const filePath = path.join(CONFIG.UPLOAD_DIR, fileName)

    // 保存文件
    await writeFile(filePath, buffer)

    // 返回访问 URL
    const url = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      data: {
        url,
        fileName,
        originalSize: file.size,
        compressedSize: buffer.length,
        compressed: buffer.length < file.size,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '上传失败，请重试',
      },
      { status: 500 }
    )
  }
}
