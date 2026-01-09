# 阿真个人技术博客

一个基于 Next.js 16 构建的现代化个人技术博客，采用前后端分离架构，支持题库管理、富文本编辑和分类系统。

## ✨ 特性

- 🎨 **现代化设计** - 美观的渐变配色和流畅动画
- 📝 **富文本编辑** - 支持代码高亮（使用原生 contenteditable）
- 🗂️ **分类管理** - 按技术方向组织内容
- 🔍 **智能搜索** - 快速查找题目
- ⭐ **常考题标记** - 重点复习高频面试题
- 📱 **响应式设计** - 完美适配各种设备
- 🚀 **前后端分离** - Next.js + Spring Boot 架构

## 🛠️ 技术栈

### 前端
- **Next.js 16** - React 框架（App Router）
- **React 19** - UI 库
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 样式框架

### 后端
- **Spring Boot 3.2.1** - Java Web 框架
- **Spring Data JPA** - 数据持久层
- **MySQL 8+** - 关系型数据库
- **Flyway** - 数据库版本管理

### 部署平台
- **Netlify** - 前端部署（推荐）
- **Render** - 后端部署（推荐）

## 🚀 快速开始

### 本地开发

#### 启动后端（需要 Java 17 和 Maven）

```bash
cd backend
bash deploy.sh
```

后端将在 http://localhost:8080 启动

#### 启动前端

```bash
# 安装依赖
pnpm install

# 配置后端地址（在 .env.local 文件中）
NEXT_PUBLIC_API_URL=http://localhost:8080

# 启动开发服务器
pnpm run dev
```

前端将在 http://localhost:5000 启动

## 📦 部署

详细部署文档：[DEPLOYMENT.md](./DEPLOYMENT.md)

### 前端部署
推荐使用 **Netlify**，只需几分钟即可上线

### 后端部署
推荐使用 **Render** 或其他支持 Java 的云平台

## 📁 项目结构

```
.
├── src/                       # 前端源码
│   ├── app/
│   │   ├── page.tsx           # 主页面
│   │   ├── page/
│   │   │   ├── HomePage.tsx   # 首页组件
│   │   │   └── QuestionBankPage.tsx  # 题库页面
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── RichTextEditor.tsx    # 富文本编辑器
│   │   ├── AlertModal.tsx        # 警告弹窗
│   │   ├── ConfirmDialog.tsx     # 确认对话框
│   │   └── InputDialog.tsx       # 输入对话框
│   └── lib/
│       └── api.ts             # API 客户端
├── backend/                   # 后端源码
│   ├── src/main/java/com/azhen/blog/
│   │   ├── controller/        # REST API 控制器
│   │   ├── service/          # 业务逻辑层
│   │   ├── repository/       # 数据访问层
│   │   ├── entity/           # 数据库实体
│   │   ├── dto/              # 数据传输对象
│   │   └── config/           # 配置类
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/     # Flyway 数据库迁移脚本
│   ├── pom.xml               # Maven 配置
│   └── deploy.sh             # 部署脚本
├── .coze                      # 项目配置
├── .env.local                 # 环境变量（不提交到 Git）
├── .env.local.example         # 环境变量示例
├── netlify.toml               # Netlify 配置
└── package.json               # 前端依赖管理
```

## 🎯 核心功能

### 1. 首页
- 技术栈展示
- 常用第三方库介绍
- 美观的渐变设计

### 2. 题库管理
- 创建、编辑、删除题目
- 分类管理
- 富文本内容编辑（原生 contenteditable）
- 代码高亮（固定深色主题）
- 常考题标记
- 搜索和筛选

### 3. 分类系统
- 按技术方向组织
- 自定义排序
- 快速筛选

## 🔧 环境变量

复制 `.env.local.example` 为 `.env.local` 并配置：

```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:8080

# 生产环境示例：
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📚 文档

- [完整部署文档](./DEPLOYMENT.md) - 详细部署步骤（前后端分离部署）
- [后端文档](./backend/README.md) - 后端开发说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

阿真 - 专注于前端技术分享

---

**开始使用**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解如何部署你的博客！
