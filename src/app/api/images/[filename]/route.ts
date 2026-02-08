import { NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const filePath = path.join(UPLOAD_DIR, filename)

  try {
    // 检查文件是否存在
    const fileStat = await stat(filePath)

    // 根据文件扩展名设置 Content-Type
    const ext = path.extname(filename).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    }

    const contentType = contentTypeMap[ext] || 'application/octet-stream'

    // 读取文件
    const fileBuffer = await readFile(filePath)

    // 返回文件
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // 缓存 1 年
      },
    })
  } catch (error) {
    console.error('Error serving image:', filename, error)
    return NextResponse.json(
      { error: '图片不存在' },
      { status: 404 }
    )
  }
}
