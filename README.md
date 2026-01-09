# 阿真个人技术博客

一个基于 Next.js 16 构建的现代化个人技术博客，支持题库管理、富文本编辑和分类系统。

## ✨ 特性

- 🎨 **现代化设计** - 美观的渐变配色和流畅动画
- 📝 **富文本编辑** - 支持代码高亮、图片上传
- 🗂️ **分类管理** - 按技术方向组织内容
- 🔍 **智能搜索** - 快速查找题目
- ⭐ **常考题标记** - 重点复习高频面试题
- 📱 **响应式设计** - 完美适配各种设备
- 🚀 **高性能** - Next.js 16 + React 19

## 🛠️ 技术栈

### 前端
- **Next.js 16** - React 框架
- **React 19** - UI 库
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 样式框架

### 后端
- **Next.js API Routes** - 服务端 API
- **PostgreSQL** - 数据库
- **Drizzle ORM** - ORM 工具

### 存储
- **S3 Storage** - 图片存储
- **对象存储** - 文件管理

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

访问 http://localhost:5000

## 📦 部署

### 推荐：部署到 Netlify

[点击查看快速部署指南](./QUICK_START.md)

详细部署文档：[DEPLOYMENT.md](./DEPLOYMENT.md)

**只需 5 分钟即可上线！**

## 📁 项目结构

```
.
├── src/
│   ├── app/
│   │   ├── page.tsx           # 主页面
│   │   ├── page/
│   │   │   ├── HomePage.tsx   # 首页组件
│   │   │   └── QuestionBankPage.tsx  # 题库页面
│   │   ├── api/               # API 路由
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   └── lib/                   # 工具库
├── .coze                      # 项目配置
├── netlify.toml               # Netlify 配置
└── package.json               # 依赖管理
```

## 🎯 核心功能

### 1. 首页
- 技术栈展示
- 常用第三方库介绍
- 美观的渐变设计

### 2. 题库管理
- 创建、编辑、删除题目
- 分类管理
- 富文本内容编辑
- 图片上传
- 常考题标记
- 搜索和筛选

### 3. 分类系统
- 按技术方向组织
- 自定义排序
- 快速筛选

## 🔧 环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```env
DATABASE_URL=your-database-url
S3_BUCKET_NAME=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

## 📚 文档

- [快速部署指南](./QUICK_START.md) - 5 分钟快速上线
- [完整部署文档](./DEPLOYMENT.md) - 详细部署步骤
- [环境变量配置](./.env.example) - 环境变量说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

阿真 - 专注于前端技术分享

---

**开始使用**：查看 [QUICK_START.md](./QUICK_START.md) 快速部署你的博客！
