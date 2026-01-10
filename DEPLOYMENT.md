# 部署指南

本文档说明如何将博客系统部署到 Render 平台。

## 前置条件

- GitHub 账户
- Render 账户（免费版即可）
- 已完成项目代码推送到 GitHub

## Render 部署步骤

### 1. 创建 Web Service

1. 登录 [Render](https://render.com)
2. 点击 "New +" 按钮，选择 "Web Service"
3. 连接你的 GitHub 仓库
4. 配置构建和运行命令：

**Build Command:**
```bash
npm install
npm run build
```

**Start Command:**
```bash
npm start
```

**Runtime:**
- Node.js 18.x 或更高版本

### 2. 配置环境变量（重要！）

在 Render 的 Environment Variables 部分添加以下变量：

#### 必需的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `COZE_BUCKET_ENDPOINT_URL` | 对象存储端点 | `https://your-bucket-endpoint.com` |
| `COZE_BUCKET_NAME` | 存储桶名称 | `your-bucket-name` |

#### 配置步骤

1. 在 Web Service 页面，找到 "Environment" 部分
2. 点击 "Add Environment Variable"
3. 逐个添加上述环境变量
4. 保存后，Render 会自动重新部署

### 3. 对象存储配置说明

图片上传功能需要对象存储支持。你需要：

1. **获取对象存储配置**：
   - 如果你有自己的 S3 兼容存储服务，从服务商处获取 endpoint 和 bucket name
   - 或使用其他云服务（如 AWS S3、阿里云 OSS、腾讯云 COS 等）

2. **配置环境变量**：

**AWS S3 示例：**
```
COZE_BUCKET_ENDPOINT_URL=https://s3.amazonaws.com
COZE_BUCKET_NAME=my-blog-uploads
```

**阿里云 OSS 示例：**
```
COZE_BUCKET_ENDPOINT_URL=https://oss-cn-hangzhou.aliyuncs.com
COZE_BUCKET_NAME=my-blog-bucket
```

**腾讯云 COS 示例：**
```
COZE_BUCKET_ENDPOINT_URL=https://cos.ap-guangzhou.myqcloud.com
COZE_BUCKET_NAME=my-bucket-1234567890
```

### 4. 部署后端（可选）

如果你的后端部署在 Render：

1. 创建另一个 Web Service
2. 连接到后端的 GitHub 仓库
3. 配置环境变量（如需要）
4. 设置构建和运行命令

### 5. 防止服务休眠

Render 免费版的服务会在 15 分钟无活动后进入休眠。为防止休眠，可以使用 UptimeRobot：

1. 注册 [UptimeRobot](https://uptimerobot.com)
2. 添加一个新的 Monitor
3. 类型选择 "HTTPS"
4. URL 填入你的 Render 服务地址
5. 间隔设置为 5 分钟

### 6. 配置自定义域名（可选）

1. 在 Render Web Service 页面，找到 "Custom Domains" 部分
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 常见问题

### Q: 图片上传失败，提示 "Storage endpoint not configured"

**A:** 这是因为对象存储环境变量未配置。请检查：
1. Render 的 Environment Variables 中是否添加了 `COZE_BUCKET_ENDPOINT_URL` 和 `COZE_BUCKET_NAME`
2. 环境变量的值是否正确
3. 添加环境变量后，等待 Render 自动重新部署

### Q: 如何测试环境变量是否正确配置？

**A:** 在代码中添加调试日志：
```javascript
console.log('Environment variables:', {
  endpoint: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucket: process.env.COZE_BUCKET_NAME,
})
```
查看 Render 的日志输出。

### Q: 图片上传成功但无法访问？

**A:** 检查：
1. 存储桶的访问权限设置
2. 签名 URL 是否已过期（默认 24 小时）
3. CORS 配置是否正确

### Q: 本地开发如何配置环境变量？

**A:** 创建 `.env.local` 文件（不要提交到 Git）：
```env
COZE_BUCKET_ENDPOINT_URL=your-endpoint
COZE_BUCKET_NAME=your-bucket
```

## 更新部署

每次推送到 GitHub 后，Render 会自动检测到变化并触发重新部署。

## 监控和日志

- 访问 Render 的 "Logs" 页面查看应用日志
- 使用 "Metrics" 查看性能指标
- 设置告警（Alerts）监控服务健康状态

## 联系方式

如有问题，请查看：
- [Render 文档](https://render.com/docs)
- 项目 GitHub Issues
