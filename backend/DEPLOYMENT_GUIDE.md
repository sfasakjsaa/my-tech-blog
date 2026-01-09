# Azhen Blog - 完整部署指南

## 项目概述

**Azhen 个人技术博客** - 基于 Spring Boot + MySQL + Next.js 的全栈博客系统

### 技术栈

**前端**
- Next.js 16 (React 19)
- TypeScript 5
- Tailwind CSS 4
- 现代化设计风格

**后端**
- Spring Boot 3.2.1
- MySQL 8+
- Spring Data JPA (Hibernate)
- Flyway (数据库迁移)

**部署**
- 前端：Netlify
- 后端：Render / Railway / 自建服务器
- 数据库：MySQL (Docker / 云服务)

---

## 项目结构

```
azhen-blog/
├── backend/                    # Spring Boot 后端
│   ├── src/
│   │   └── main/
│   │       ├── java/com/azhen/blog/
│   │       │   ├── BlogBackendApplication.java
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       └── resources/
│   │           ├── application.properties
│   │           └── db/migration/
│   ├── pom.xml
│   ├── deploy.sh              # 部署脚本
│   ├── test-api.sh            # API 测试脚本
│   ├── README.md              # 后端文档
│   └── QUICK_START.md         # 快速开始指南
│
└── src/                       # Next.js 前端
    ├── app/
    │   ├── api/               # 前端 API 路由（已废弃，改用后端）
    │   ├── questions/         # 题库页面
    │   ├── layout.tsx
    │   └── page.tsx           # 首页
    ├── components/            # React 组件
    ├── storage/               # 数据存储（已废弃）
    ├── lib/                   # 工具函数
    └── ...
```

---

## 快速开始

### 前提条件

- Node.js 18+
- Java 17+
- Maven 3.6+
- MySQL 8+

### 步骤 1: 克隆项目

```bash
git clone <your-repo-url>
cd azhen-blog
```

### 步骤 2: 启动 MySQL

**使用 Docker（推荐）**
```bash
docker run --name azhen-mysql \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=azhen_blog \
  -p 3306:3306 \
  -d mysql:8
```

### 步骤 3: 启动后端

```bash
cd backend

# 使用部署脚本
./deploy.sh

# 或者手动启动
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 步骤 4: 启动前端

```bash
# 在项目根目录创建 .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# 启动前端
npm run dev
```

前端将在 `http://localhost:3000` 启动

### 步骤 5: 测试

访问 http://localhost:3000，测试以下功能：
- ✅ 查看首页
- ✅ 创建分类
- ✅ 添加题目
- ✅ 编辑题目
- ✅ 搜索题目
- ✅ 移动端适配

---

## 生产环境部署

### 方案 1: 最简单方案（推荐）

**前端部署到 Netlify + 后端部署到 Render**

#### 1.1 前端部署到 Netlify

```bash
# 在项目根目录
git push origin main
```

1. 访问 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub → 选择你的仓库
4. 配置构建命令：`npm run build`
5. 配置发布目录：`.next`
6. 添加环境变量：
   - `NODE_VERSION`: 20
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.com`
7. 点击 "Deploy site"

#### 1.2 后端部署到 Render

1. 将 `backend/` 目录推送到独立的 GitHub 仓库
2. 访问 https://render.com
3. 点击 "New" → "Web Service"
4. 连接你的后端仓库
5. 配置：
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/blog-backend-1.0.0.jar`
6. 添加环境变量：
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://your-host:3306/azhen_blog`
   - `SPRING_DATASOURCE_USERNAME`: `your-username`
   - `SPRING_DATASOURCE_PASSWORD`: `your-password`
7. 点击 "Deploy"

#### 1.3 获取 Render MySQL 数据库（可选）

如果不想自己建 MySQL：

1. 在 Render 点击 "New" → "Database"
2. 选择 "MySQL"
3. 创建数据库
4. 复制连接信息到后端的环境变量

### 方案 2: 全部部署到 Railway

```bash
# 前端和后端可以放在同一个仓库
git push origin main
```

1. 访问 https://railway.app
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库
4. Railway 会自动检测前后端项目
5. 配置环境变量
6. 点击 "Deploy"

### 方案 3: 自建服务器

适合有自己服务器的用户。

#### 3.1 准备服务器

```bash
# 安装必要软件
sudo apt update
sudo apt install openjdk-17-jdk maven mysql-server nginx

# 配置 MySQL
sudo mysql_secure_installation
```

#### 3.2 部署后端

```bash
# 克隆代码
git clone <your-repo-url>
cd your-repo/backend

# 配置数据库
vim src/main/resources/application.properties

# 启动服务
./deploy.sh

# 使用 systemd 管理
sudo cp blog-backend.service /etc/systemd/system/
sudo systemctl enable blog-backend
sudo systemctl start blog-backend
```

#### 3.3 部署前端

```bash
# 构建
cd ..
npm run build

# 使用 Nginx 代理
sudo cp nginx.conf /etc/nginx/sites-available/azhen-blog
sudo ln -s /etc/nginx/sites-available/azhen-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## API 文档

### 基础 URL

```
本地开发: http://localhost:8080/api
生产环境: https://your-backend-url.com/api
```

### 分类管理

#### 获取所有分类
```
GET /categories

响应:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "前端技术",
      "order": "1",
      "createdAt": "2024-01-09T12:00:00"
    }
  ]
}
```

#### 创建分类
```
POST /categories
Content-Type: application/json

{
  "name": "前端技术",
  "order": "1"
}

响应:
{
  "success": true,
  "data": { ... }
}
```

#### 更新分类
```
PUT /categories/{id}
Content-Type: application/json

{
  "name": "前端技术",
  "order": "2"
}

响应:
{
  "success": true,
  "data": { ... }
}
```

#### 删除分类
```
DELETE /categories/{id}

响应:
{
  "success": true
}
```

### 题目管理

#### 获取题目列表
```
GET /questions?categoryId={id}&search={keyword}

响应:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "title": "题目标题",
      "content": "题目内容",
      "isFrequent": true,
      "order": "1",
      "createdAt": "2024-01-09T12:00:00"
    }
  ]
}
```

#### 创建题目
```
POST /questions
Content-Type: application/json

{
  "categoryId": "uuid",
  "title": "题目标题",
  "content": "题目内容",
  "isFrequent": true
}

响应:
{
  "success": true,
  "data": { ... }
}
```

#### 更新题目
```
PUT /questions/{id}
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "isFrequent": false
}

响应:
{
  "success": true,
  "data": { ... }
}
```

#### 删除题目
```
DELETE /questions/{id}

响应:
{
  "success": true
}
```

---

## 环境变量配置

### 前端 (.env.local)

```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:8080

# 本地开发
NEXT_PUBLIC_API_URL=http://localhost:8080

# 生产环境（示例）
NEXT_PUBLIC_API_URL=https://azhen-blog-backend.onrender.com
```

### 后端 (application.properties 或环境变量)

```properties
# 数据库连接
spring.datasource.url=jdbc:mysql://localhost:3306/azhen_blog
spring.datasource.username=root
spring.datasource.password=yourpassword

# 服务端口
server.port=8080
```

---

## 数据库管理

### 查看 Flyway 迁移历史

```bash
cd backend
mvn flyway:info
```

### 手动执行迁移

```bash
mvn flyway:migrate
```

### 清理并重建数据库（仅限开发环境）

```bash
mvn flyway:clean
mvn flyway:migrate
```

### 连接数据库

```bash
mysql -h localhost -u root -p azhen_blog
```

---

## 常见问题

### Q1: 后端启动失败，提示数据库连接错误

**A:** 检查以下几点：
1. MySQL 是否正在运行？
2. 数据库 `azhen_blog` 是否已创建？
3. 用户名和密码是否正确？
4. 防火墙是否允许连接？

### Q2: 前端无法调用后端 API

**A:** 检查以下几点：
1. 后端是否正在运行？
2. `.env.local` 中的 `NEXT_PUBLIC_API_URL` 是否正确？
3. CORS 配置是否正确？
4. 网络是否可访问？

### Q3: 部署到 Netlify 后 404 错误

**A:** 检查以下几点：
1. 构建配置是否正确？
2. 发布目录是否是 `.next`？
3. 环境变量是否已配置？
4. 重新部署是否成功？

### Q4: Render 部署失败

**A:** 检查部署日志，常见问题：
1. 构建命令是否正确？
2. 启动命令是否正确？
3. 环境变量是否已配置？
4. 数据库是否可访问？

---

## 维护和更新

### 更新后端

```bash
cd backend
git pull origin main
mvn clean package
sudo systemctl restart blog-backend
```

### 更新前端

```bash
git pull origin main
npm install
npm run build
# Netlify 会自动重新部署
```

### 数据库备份

```bash
# 备份
mysqldump -u root -p azhen_blog > backup.sql

# 恢复
mysql -u root -p azhen_blog < backup.sql
```

---

## 联系和支持

- 查看后端文档：[backend/README.md](backend/README.md)
- 查看快速开始：[backend/QUICK_START.md](backend/QUICK_START.md)
- 问题反馈：提交 GitHub Issue

---

## 许可证

MIT License
