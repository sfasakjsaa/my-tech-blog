import { NextResponse } from 'next/server'
import { S3Storage } from 'coze-coding-dev-sdk'

export async function POST(request: Request) {
  // 初始化对象存储（确保环境变量已加载）
  const storage = new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: '',
    secretKey: '',
    bucketName: process.env.COZE_BUCKET_NAME,
    region: 'cn-beijing',
  })
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '只支持上传图片文件 (JPEG, PNG, GIF, WebP)' },
        { status: 400 }
      )
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '图片大小不能超过 5MB' },
        { status: 400 }
      )
    }

    // 将 File 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 生成文件名
    const fileName = `uploads/images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // 上传文件
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type,
    })

    // 生成签名 URL
    const url = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400, // 24小时有效期
    })

    return NextResponse.json({
      success: true,
      data: {
        url,
        key: fileKey,
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
