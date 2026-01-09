# 快速开始指南

欢迎使用阿真个人技术博客！本指南将帮助你快速启动项目。

## 🚀 5 分钟快速启动

### 方法 1: 使用部署脚本（推荐）

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd <project-directory>

# 2. 运行部署脚本
./deploy.sh

# 3. 按照脚本提示完成部署
```

### 方法 2: 手动启动

```bash
# 1. 安装前端依赖
pnpm install

# 2. 安装后端依赖
cd backend
npm install
cd ..

# 3. 启动后端服务
cd backend
node server.js &
cd ..

# 4. 启动前端服务
pnpm dev
```

访问 http://localhost:5000 即可查看应用。

## 📁 项目结构

```
├── src/                  # 前端源码
│   ├── app/              # Next.js App Router
│   │   ├── api/proxy/   # API 代理层
│   │   ├── page/        # 页面组件
│   │   └── layout.tsx   # 根布局
│   ├── components/      # React 组件
│   │   ├── RichTextEditor.tsx  # 富文本编辑器
│   │   ├── ConfirmDialog.tsx    # 确认对话框
│   │   └── AlertModal.tsx      # 提示框
│   ├── lib/             # 工具函数
│   │   └── api.ts       # API 客户端
│   └── styles/          # 样式文件
├── backend/             # 后端源码
│   ├── server.js        # Express 服务器
│   ├── package.json     # Node.js 依赖
│   ├── Procfile         # Render 部署配置
│   └── data/            # JSON 数据文件
│       ├── categories.json
│       └── questions.json
├── public/              # 静态资源
├── .env.example         # 环境变量示例
├── netlify.toml         # Netlify 配置
├── deploy.sh            # 部署脚本
├── README.md            # 完整文档
└── DEPLOYMENT_CHECKLIST.md  # 部署检查清单
```

## 🎯 核心功能

### 分类管理
- ✅ 查看所有分类
- ✅ 创建新分类
- ✅ 编辑分类名称
- ✅ 删除分类
- ✅ 调整分类顺序

### 题目管理
- ✅ 查看题目列表
- ✅ 创建新题目（支持富文本）
- ✅ 编辑题目内容
- ✅ 删除题目
- ✅ 搜索题目
- ✅ 标记常考题
- ✅ 按常考题筛选

### 响应式设计
- ✅ 桌面端：左侧导航，右侧内容
- ✅ 移动端：顶部导航，汉堡菜单
- ✅ 自适应布局，流畅动画

## 💡 常用命令

### 前端命令
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm start

# 代码检查
pnpm run lint
```

### 后端命令
```bash
# 安装依赖
cd backend
npm install

# 启动开发服务器
npm run dev

# 启动生产服务器
npm start
```

## 🔧 配置说明

### 前端环境变量

创建 `.env.local` 文件：
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 后端环境变量

创建 `backend/.env` 文件：
```env
PORT=8080
NODE_ENV=development
```

## 📊 数据管理

### 初始化数据

数据存储在 JSON 文件中：
- `backend/data/categories.json` - 分类数据
- `backend/data/questions.json` - 题目数据

### 备份数据

```bash
# 备份数据
cp backend/data/categories.json backend/data/categories.backup.json
cp backend/data/questions.json backend/data/questions.backup.json
```

### 恢复数据

```bash
# 恢复数据
cp backend/data/categories.backup.json backend/data/categories.json
cp backend/data/questions.backup.json backend/data/questions.json
```

## 🎨 自定义样式

### 修改主题颜色

编辑 `src/app/layout.tsx`：
```typescript
// 修改渐变色
background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

### 修改字体

编辑 `tailwind.config.js` 或在组件中使用自定义字体类。

## 🔌 添加新功能

### 1. 添加新页面

```bash
mkdir -p src/app/new-page
touch src/app/new-page/page.tsx
```

### 2. 添加新 API 端点

在 `backend/server.js` 中添加：
```javascript
app.get('/api/new-endpoint', async (req, res) => {
  // 你的逻辑
});
```

### 3. 添加 API 代理

```bash
mkdir -p src/app/api/proxy/new-endpoint
touch src/app/api/proxy/new-endpoint/route.ts
```

在 `route.ts` 中：
```typescript
const BACKEND_URL = 'http://localhost:8080'

export async function GET() {
  const response = await fetch(`${BACKEND_URL}/api/new-endpoint`)
  const data = await response.json()
  return NextResponse.json(data)
}
```

## 🐛 故障排查

### 问题：端口被占用
```bash
# 查找占用端口的进程
lsof -i :5000
lsof -i :8080

# 杀死进程
kill -9 <PID>
```

### 问题：依赖安装失败
```bash
# 清除缓存
rm -rf node_modules
rm -rf .next

# 重新安装
pnpm install
```

### 问题：API 请求失败
1. 检查后端服务是否运行：`curl http://localhost:8080/api/categories`
2. 检查前端代理配置：查看 `src/app/api/proxy/*/route.ts` 中的 `BACKEND_URL`
3. 查看浏览器控制台的错误信息

### 问题：数据丢失
1. 从备份恢复数据（见上面的数据管理）
2. 检查文件权限：`ls -l backend/data/`
3. 生产环境建议使用数据库（见 README.md）

## 📚 进一步学习

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Express 文档](https://expressjs.com/)

## 🚀 部署到生产环境

详细部署步骤请参考：
- [部署检查清单](./DEPLOYMENT_CHECKLIST.md)
- [完整文档](./README.md)

快速部署命令：
```bash
# 运行部署脚本
./deploy.sh
```

## 💬 获取帮助

遇到问题？
1. 查看 [README.md](./README.md)
2. 查看 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. 搜索项目 Issues
4. 提交新的 Issue

## 🎉 开始使用

现在你可以：
1. 启动本地开发服务器
2. 访问 http://localhost:5000
3. 开始创建你的第一个分类和题目
4. 尝试编辑和删除功能
5. 测试搜索和筛选功能

祝你使用愉快！ 🎊
