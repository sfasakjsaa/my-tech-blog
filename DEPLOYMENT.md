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
   - 连接 GitHub 仓库（将 backend 目录作为独立仓库或使用 monorepo）
   - 构建命令: `mvn clean package -DskipTests`
   - 启动命令: `java -jar target/blog-backend-1.0.0.jar`
3. 添加环境变量：
   - `SPRING_DATASOURCE_URL`: MySQL 数据库连接字符串
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

1. 在 Netlify.com 创建新账户
2. 点击 "Add new site" -> "Import an existing project"
3. 连接 GitHub 仓库
4. 构建设置：
   - Build command: `pnpm run build`
   - Publish directory: `.next`
5. 在 "Site settings" -> "Build & deploy" -> "Environment variables" 中添加：
   - `NEXT_PUBLIC_API_URL`: 你的后端地址
6. 点击 "Deploy site"

## 本地开发

### 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端将在 http://localhost:8080 启动

### 启动前端

```bash
# 配置 .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

前端将在 http://localhost:5000 启动

## 常见问题

### 1. CORS 错误

确保后端已配置 CORS，允许前端域名访问。后端已包含 `CorsConfig.java` 配置类。

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

## 项目结构

```
.
├── src/                  # Next.js 前端
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/             # Spring Boot 后端
│   ├── src/main/java/
│   └── src/main/resources/
├── package.json
├── .env.local          # 前端环境变量
└── netlify.toml        # Netlify 配置
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
