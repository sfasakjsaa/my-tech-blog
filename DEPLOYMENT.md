# 阿真个人技术博客 - 部署指南

## 项目架构

本项目采用前后端分离架构：
- **前端**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **后端**: Spring Boot 3.2.1 + MySQL 8 + Spring Data JPA + Flyway

## 部署步骤

### 一、后端部署

#### 1. 环境准备

在本地或云端服务器准备以下环境：
- Java 17 或更高版本
- Maven 3.6+
- MySQL 8.0 或更高版本

#### 2. 数据库配置

创建 MySQL 数据库：

```sql
CREATE DATABASE azhen_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. 配置后端

修改 `backend/src/main/resources/application.properties`:

```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/azhen_blog
spring.datasource.username=your_username
spring.datasource.password=your_password

# Flyway 配置（自动初始化数据库表）
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
```

#### 4. 部署到 Render（推荐）

1. 在 Render.com 创建新账户
2. 创建 Web Service：
   - 连接 GitHub 仓库
   - 选择 backend 目录
   - 构建命令: `bash deploy.sh`
   - 启动命令: `java -jar target/blog-backend-1.0.0.jar`
3. 添加环境变量：
   - `DATABASE_URL`: MySQL 数据库连接字符串
   - `SPRING_DATASOURCE_USERNAME`: 数据库用户名
   - `SPRING_DATASOURCE_PASSWORD`: 数据库密码

#### 5. 获取后端 URL

部署完成后，Render 会提供一个 URL，例如：
```
https://azhen-blog-backend.onrender.com
```

### 二、前端部署

#### 1. 配置环境变量

在项目根目录创建 `.env.local`:

```env
# 后端 API 地址（修改为你的后端地址）
NEXT_PUBLIC_API_URL=https://azhen-blog-backend.onrender.com
```

#### 2. 部署到 Netlify（推荐）

**方法 A: 通过 Netlify 网站部署**

1. 在 Netlify.com 创建新账户
2. 点击 "Add new site" -> "Import an existing project"
3. 连接 GitHub 仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `.next` (注意：Next.js 16 的输出目录)
5. 在 "Site settings" -> "Build & deploy" -> "Environment variables" 中添加：
   - `NEXT_PUBLIC_API_URL`: 你的后端地址
6. 点击 "Deploy site"

**方法 B: 使用 Netlify CLI**

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化部署
netlify init

# 构建并部署
netlify deploy --prod
```

#### 3. 配置 Next.js 输出（可选）

为了更好的性能，可以修改 `next.config.ts` 使用静态导出：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

export default nextConfig
```

### 三、验证部署

1. 访问前端 URL，检查页面是否正常加载
2. 尝试添加分类和题目，验证前后端通信
3. 检查浏览器控制台，确保没有错误

## 常见问题

### 1. CORS 错误

确保后端已配置 CORS，允许前端域名访问：

```java
@CorsConfiguration
@Configuration
public class CorsConfig {
    // 已在项目中配置
}
```

### 2. API 调用失败

检查：
- `.env.local` 中的 `NEXT_PUBLIC_API_URL` 是否正确
- 后端服务是否正常运行
- 网络连接是否正常

### 3. 数据库连接失败

检查：
- MySQL 数据库是否已创建
- 数据库用户名和密码是否正确
- Render 等平台的数据库连接配置是否正确

### 4. 图片上传功能

当前版本暂时禁用了图片上传功能。如需启用，需要：
1. 配置后端的 S3 存储服务
2. 实现上传 API
3. 前端添加上传组件

## 本地开发

### 启动后端

```bash
cd backend
bash deploy.sh
```

后端将在 http://localhost:8080 启动

### 启动前端

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

前端将在 http://localhost:5000 启动

## 项目结构

```
.
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 主页面
│   │   ├── layout.tsx    # 布局
│   │   └── globals.css   # 全局样式
│   ├── components/       # React 组件
│   │   ├── RichTextEditor.tsx
│   │   ├── AlertModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── InputDialog.tsx
│   └── lib/
│       └── api.ts        # API 客户端
├── backend/              # Spring Boot 后端
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           └── db/migration/  # Flyway 数据库迁移
│   ├── pom.xml
│   └── deploy.sh
├── package.json
├── .env.local           # 前端环境变量
└── .coze                # Coze 项目配置
```

## 技术栈

### 前端
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- 原生 contenteditable 实现富文本编辑

### 后端
- Spring Boot 3.2.1
- Spring Data JPA
- Flyway (数据库迁移)
- MySQL 8+

## 联系方式

如有问题，请联系项目维护者。
