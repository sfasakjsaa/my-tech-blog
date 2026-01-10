# 图片存储说明

本博客系统使用**本地文件系统**存储图片，无需配置外部对象存储服务。

## 功能特性

### 自动优化
- **图片压缩**：自动调整图片尺寸（最大 1920x1080）并压缩质量
- **格式支持**：JPEG、PNG、GIF、WebP
- **智能压缩**：JPEG 质量 85%，PNG 质量 85%，WebP 质量 80%

### 存储限制
- **单文件大小**：最大 2MB
- **总存储大小**：最大 50MB
- **最大文件数**：100 个

### 自动清理
采用 **FIFO（先进先出）** 策略自动清理旧文件：
- 当总存储大小接近限制时，自动删除最旧的图片
- 当文件数量达到限制时，自动删除最旧的图片
- 每次上传前预留 10% 的空间

## 配置说明

所有配置都在 `src/app/api/upload/route.ts` 文件中，可以根据需要调整：

```typescript
const CONFIG = {
  MAX_FILE_SIZE: 2 * 1024 * 1024,      // 单个文件最大 2MB
  MAX_TOTAL_SIZE: 50 * 1024 * 1024,    // 总存储最大 50MB
  MAX_FILE_COUNT: 100,                   // 最大文件数
  MAX_IMAGE_WIDTH: 1920,                 // 压缩后最大宽度
  MAX_IMAGE_HEIGHT: 1080,               // 压缩后最大高度
  JPEG_QUALITY: 85,                      // JPEG 压缩质量
  WEBP_QUALITY: 80,                      // WebP 压缩质量
  UPLOAD_DIR: 'public/uploads',          // 上传目录
}
```

## 文件位置

- **上传目录**：`/tmp/uploads/`（临时目录）
- **访问 URL**：`/api/images/文件名`
- **示例**：上传的文件 `1234567890_abc123.jpg` 可通过 `/api/images/1234567890_abc123.jpg` 访问

## 部署注意事项

### Render 部署
Render 的文件系统是**临时的**，每次重新部署都会清空：
- 图片文件会丢失
- 不影响博客文章（文章内容中的图片链接会失效）
- 使用 `/tmp` 目录和 API 路由访问，解决构建后文件访问问题

**解决方案**：
1. 接受此限制，重新部署后重新上传图片
2. 或者切换到对象存储（需要配置环境变量）

### 本地开发
本地开发时图片文件会持久保存。

### 其他部署平台
如果平台提供持久化存储（如 Vercel、Netlify 等），图片会持久保存。

## 迁移到对象存储（可选）

如果需要持久化存储，可以修改为对象存储方案：

1. 安装依赖：
```bash
pnpm add coze-coding-dev-sdk
```

2. 在部署平台配置环境变量：
```
COZE_BUCKET_ENDPOINT_URL=your-endpoint
COZE_BUCKET_NAME=your-bucket-name
```

3. 修改 `src/app/api/upload/route.ts` 使用 S3Storage

## 技术栈

- **图片处理**：Sharp
- **文件系统**：Node.js fs/promises API
- **路径处理**：Node.js path 模块

## 测试

测试图片上传功能：
```bash
# 上传测试图片
curl -X POST -F "file=@test.png;type=image/png" http://localhost:5000/api/upload

# 访问上传的图片
curl http://localhost:5000/api/images/<filename>
```

## 常见问题

### Q: 图片上传失败？
**A:** 检查以下几点：
- 图片格式是否为 JPEG、PNG、GIF 或 WebP
- 图片大小是否超过 2MB
- 存储空间是否已满（检查自动清理是否正常）

### Q: 图片质量不好？
**A:** 调整压缩质量参数：
- 提高 JPEG_QUALITY（最大 100）
- 提高 WEBP_QUALITY（最大 100）

### Q: 如何清理所有图片？
**A:** 删除 `public/uploads/` 目录下所有文件（保留 .gitkeep）：
```bash
rm -f public/uploads/*
```

### Q: 如何备份图片？
**A:** 定期备份 `public/uploads/` 目录：
```bash
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz public/uploads/
```
