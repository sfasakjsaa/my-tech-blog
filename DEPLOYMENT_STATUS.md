# 部署状态说明

## 当前状态

### ✅ 前端服务
- **运行端口**: 5000
- **技术栈**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
- **状态**: 正常运行
- **访问地址**: http://localhost:5000
- **API 代理**: 使用 Next.js API Routes 代理后端请求

### ✅ 后端服务
- **运行端口**: 8080
- **技术栈**: Node.js + Express
- **数据存储**: JSON 文件（位于 `backend/data/` 目录）
- **状态**: 正常运行
- **API 端点**: http://localhost:8080

### ✅ 数据初始化
- **分类**: React, TypeScript, Next.js (共 3 个)
- **题目**: 4 个测试题目已添加
- **数据位置**: `backend/data/categories.json`, `backend/data/questions.json`

## 问题解决

### 原始问题
```
Failed to fetch
src/lib/api.ts (42:28) @ request
```

### 问题原因分析
1. **Spring Boot 后端依赖问题**: Spring Boot 需要 Java 和 MySQL，但沙箱环境中没有安装这些组件
2. **跨域限制**: 浏览器无法直接从前端（localhost:5000）访问后端（localhost:8080）

### 解决方案
1. **后端架构调整**: 将后端从 Spring Boot 改为 Node.js + Express，使用 JSON 文件存储数据
2. **API 代理模式**: 创建 Next.js API Routes 作为代理，前端通过 `/api/proxy/*` 访问后端

### 架构变更
```
原架构: 前端 → 直接访问 → 后端 API
新架构: 前端 → Next.js API Routes → 后端 API
```

## API 代理说明

### 代理路由结构
```
src/app/api/proxy/
├── categories/
│   ├── route.ts          # GET, POST
│   ├── [id]/route.ts     # PUT, DELETE
│   └── reorder/route.ts  # POST
└── questions/
    ├── route.ts          # GET, POST
    ├── [id]/route.ts     # PUT, DELETE
    └── reorder/route.ts  # POST
```

### API 调用方式
```typescript
// 客户端代码（src/lib/api.ts）
const response = await fetch('/api/proxy/categories')  // ✅ 通过代理
// const response = await fetch('http://localhost:8080/api/categories')  // ❌ 直接访问（会失败）
```

## 测试验证

### API 测试
```bash
# 通过前端代理访问分类（推荐）
curl http://localhost:5000/api/proxy/categories

# 通过前端代理访问题目
curl http://localhost:5000/api/proxy/questions

# 直接访问后端（仅用于调试）
curl http://localhost:8080/api/categories
```

### 前端测试页面
- **主页**: http://localhost:5000
- **调试页面**: http://localhost:5000/debug
- **API 测试**: http://localhost:5000/api-test.html

## 部署指南

### 本地开发

#### 启动后端
```bash
cd backend
node server.js &
```

#### 启动前端
```bash
bash .cozeproj/scripts/dev_run.sh &
```

### 云端部署

#### 前端部署到 Netlify

**方案 1: 只部署前端（推荐）**

1. 构建前端项目
   ```bash
   pnpm run build
   ```

2. 部署到 Netlify

3. 在 Netlify 中设置环境变量（可选，因为使用代理模式，前端内部已经配置了后端地址）

**注意**: 部署到 Netlify 后，后端仍然需要单独部署到云端（如 Render、Railway）

#### 后端部署选项

**选项 1: Render (推荐)**

1. 创建 `backend/Procfile`:
   ```
   web: node server.js
   ```

2. 在 Render 上部署后端

3. 更新前端代理配置
   修改 `src/app/api/proxy/*/route.ts` 中的 `BACKEND_URL` 为实际的后端 URL

**选项 2: Vercel Serverless Functions**

将 Express 后端转换为 Vercel API Routes

**选项 3: Railway**

连接 GitHub 仓库自动部署

### 环境变量配置

#### 本地开发 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### 生产环境 (部署时设置)
- 如果使用 Netlify + Render，需要更新 `BACKEND_URL` 为实际的 Render URL
- 例如: `https://azhen-blog-backend.onrender.com`

## 注意事项

### 数据持久性
- **当前**: JSON 文件存储在本地，重启后数据会保留
- **生产环境**: 建议使用数据库（如 Supabase、MongoDB Atlas、PlanetScale）

### CORS 配置
- 后端已配置允许所有来源（`app.use(cors())`）
- 使用代理模式后，CORS 不再是问题

### 服务监控
- 后端日志: `tail -f /tmp/backend-node.log`
- 前端日志: `tail -f /tmp/frontend-new.log`

### 性能优化
- 代理模式增加了一层请求转发
- 生产环境可以考虑直接前后端分离，不使用代理

## 文件结构

```
src/app/api/proxy/     # Next.js API Routes 代理
src/lib/api.ts          # 客户端 API 客户端
src/app/page.tsx        # 主页
backend/
  ├── server.js         # Express 服务器
  ├── package.json      # Node.js 依赖
  └── data/             # JSON 数据文件
      ├── categories.json
      └── questions.json
```

## 快速启动

```bash
# 启动后端
cd backend && node server.js &

# 启动前端
bash .cozeproj/scripts/dev_run.sh &

# 检查服务状态
ss -lptn 'sport = :8080'  # 后端
ss -lptn 'sport = :5000'  # 前端

# 测试代理 API
curl http://localhost:5000/api/proxy/categories
```

## 调试工具

### 浏览器控制台
1. 打开 http://localhost:5000
2. 按 F12 打开开发者工具
3. 查看 Console 标签的调试日志
4. 查看 Network 标签的实际网络请求

### 日志文件
```bash
# 前端日志
tail -f /tmp/frontend-new.log

# 后端日志
tail -f /tmp/backend-node.log
```

## 常见问题

### Q: 为什么需要 API 代理？
A: 在某些网络环境中（特别是沙箱环境），浏览器无法直接从前端（localhost:5000）访问后端（localhost:8080）。使用 Next.js API Routes 作为代理可以解决跨域问题。

### Q: 代理会影响性能吗？
A: 会有一点额外开销，但通常可以忽略不计。生产环境可以考虑使用 CDN 或反向代理。

### Q: 部署到 Netlify 后需要修改什么？
A: 需要修改 `src/app/api/proxy/*/route.ts` 中的 `BACKEND_URL` 为实际的云端后端地址。

### Q: 可以不用代理吗？
A: 可以。如果前后端都部署在同一个域名下（如使用 Vercel），可以直接配置 CORS，无需代理。

## 开发指南

### 修改后端 API
编辑 `backend/server.js`，添加新的路由处理函数

### 修改前端页面
- 主页: `src/app/page.tsx`
- 题库页面: `src/app/page/QuestionBankPage.tsx`
- API 客户端: `src/lib/api.ts`

### 添加新的 API 端点
1. 在 `backend/server.js` 添加后端路由
2. 在 `src/app/api/proxy/` 创建对应的代理路由
3. 在 `src/lib/api.ts` 添加客户端调用方法

### 数据结构

**分类**
```typescript
{
  id: string
  name: string
  order: number
  createdAt: string
  updatedAt: string
}
```

**题目**
```typescript
{
  id: string
  title: string
  content: string
  categoryId: string
  isFrequent: boolean
  createdAt: string
  updatedAt: string
}
```

## 总结

✅ **问题已解决**: 前端通过 Next.js API Routes 代理成功访问后端
✅ **架构稳定**: 前后端分离，使用代理模式避免跨域问题
✅ **开发体验**: 本地开发无需配置 CORS，开箱即用
✅ **部署灵活**: 可根据需求选择不同的部署方案
