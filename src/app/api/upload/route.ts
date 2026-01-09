import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// 初始化 S3 客户端
const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
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
    const bucketName = process.env.S3_BUCKET_NAME

    // 验证配置
    if (!bucketName || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { success: false, error: "S3 配置缺失，请检查环境变量" },
        { status: 500 }
      )
    }

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

    // 生成文件名：使用时间戳前缀
    const fileName = `images/${Date.now()}_${file.name}`

    // 上传到 S3
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })

    await s3Client.send(command)

    // 构建公开访问 URL（根据你的 S3 配置）
    const imageUrl = `https://${bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${fileName}`

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        key: fileName,
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
