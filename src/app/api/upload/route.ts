import { NextRequest, NextResponse } from "next/server"
import { S3Storage } from "coze-coding-dev-sdk"

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
})

// 允许的图片类型
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

// 最大文件大小：5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    // 验证文件是否存在
    if (!file) {
      return NextResponse.json(
        { success: false, error: "未找到文件" },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "不支持的文件类型，仅支持图片文件" },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过 5MB" },
        { status: 400 }
      )
    }

    // 将文件转换为 Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 生成文件名：使用 UUID 前缀
    const fileName = `images/${Date.now()}_${file.name}`

    // 上传到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type,
    })

    // 生成签名 URL（有效期 7 天）
    const imageUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 60 * 60 * 24 * 7, // 7 天
    })

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        key: fileKey,
      },
    })
  } catch (error) {
    console.error("图片上传失败:", error)
    return NextResponse.json(
      { success: false, error: "图片上传失败，请重试" },
      { status: 500 }
    )
  }
}
