# 阿真个人技术博客

基于 Next.js 16 + React 19 的个人博客系统，采用前后端分离架构。

## 技术栈

### 前端
- **框架**: Next.js 16 (App Router)
- **UI**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **部署**: Netlify

### 后端
- **框架**: Node.js + Express
- **数据存储**: JSON 文件（可扩展为数据库）
- **部署**: Render / Railway / Vercel

## 功能特性

✅ 动态分类管理（支持排序）
✅ 富文本内容编辑（原生 contenteditable）
✅ 文章/题目搜索
✅ 常考题标记和筛选
✅ 响应式设计（移动端适配）
✅ 现代化渐变紫色主题
✅ 自定义弹窗组件

## 快速开始

### 本地开发

1. **安装依赖**
```bash
pnpm install
```

2. **启动后端**
```bash
cd backend
node server.js
# 后端运行在 http://localhost:8080
```

3. **启动前端**
```bash
pnpm dev
# 前端运行在 http://localhost:5000
```

4. **访问应用**
打开浏览器访问 http://localhost:5000

## 项目结构

```
├── src/                          # 前端源码
│   ├── app/                      # Next.js App Router
│   │   ├── api/proxy/           # API 代理层
│   │   ├── page/                # 页面组件
│   │   └── layout.tsx           # 根布局
│   ├── components/              # React 组件
│   ├── lib/                     # 工具函数
│   └── styles/                  # 样式文件
├── backend/                      # 后端源码
│   ├── server.js                # Express 服务器
│   ├── package.json             # Node.js 依赖
│   ├── data/                    # JSON 数据文件
│   ├── Procfile                 # Render 部署配置
│   └── .env.example             # 环境变量示例
├── public/                       # 静态资源
├── netlify.toml                 # Netlify 配置
└── package.json                 # 前端依赖
```

## 部署指南

### 前端部署到 Netlify

#### 方法 1: 通过 Git 部署（推荐）

1. **连接 GitHub 仓库**
   - 登录 [Netlify](https://app.netlify.com/)
   - 点击 "Add new site" → "Import from Git"
   - 选择你的 GitHub 仓库

2. **配置构建设置**
   ```
   Build command: pnpm run build
   Publish directory: .next
   ```

3. **设置环境变量**（可选）
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **部署**
   点击 "Deploy site"

#### 方法 2: 通过 CLI 部署

```bash
# 安装 Netlify CLI
pnpm add -g netlify-cli

# 登录
netlify login

# 构建项目
pnpm run build

# 部署
netlify deploy --prod --dir=.next
```

### 后端部署到 Render

1. **准备代码**
   确保 `backend/Procfile` 文件存在并包含：
   ```
   web: node server.js
   ```

2. **连接 GitHub**
   - 登录 [Render](https://dashboard.render.com/)
   - 点击 "New+" → "Web Service"
   - 连接 GitHub 仓库

3. **配置服务**
   ```
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. **设置环境变量**
   ```
   PORT=8080
   NODE_ENV=production
   ```

5. **部署**
   点击 "Create Web Service"

6. **获取后端 URL**
   部署完成后，Render 会提供一个 URL，例如：
   ```
   https://azhen-blog-backend.onrender.com
   ```

### 更新前端 API 代理配置

后端部署成功后，需要更新前端的 API 代理配置：

1. 修改 `src/app/api/proxy/categories/route.ts`:
```typescript
const BACKEND_URL = 'https://your-backend-url.com'
```

2. 修改 `src/app/api/proxy/questions/route.ts`:
```typescript
const BACKEND_URL = 'https://your-backend-url.com'
```

3. 修改其他 `src/app/api/proxy/` 目录下的文件

4. 重新部署前端到 Netlify

### 部署验证

部署完成后，访问前端 URL，验证以下功能：
- ✅ 页面正常加载
- ✅ 分类列表显示
- ✅ 题目列表显示
- ✅ 新增/编辑/删除题目功能正常
- ✅ 搜索功能正常
- ✅ 移动端适配正常

## 环境变量

### 前端环境变量
```env
NEXT_PUBLIC_API_URL=http://localhost:8080  # 开发环境
NEXT_PUBLIC_API_URL=https://your-backend.com  # 生产环境
```

### 后端环境变量
```env
PORT=8080
NODE_ENV=development  # 或 production
```

## API 文档

### 分类 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| POST | `/api/categories` | 创建分类 |
| PUT | `/api/categories/:id` | 更新分类 |
| DELETE | `/api/categories/:id` | 删除分类 |
| POST | `/api/categories/reorder` | 更新分类排序 |

### 题目 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/questions` | 获取题目列表（支持筛选） |
| POST | `/api/questions` | 创建题目 |
| PUT | `/api/questions/:id` | 更新题目 |
| DELETE | `/api/questions/:id` | 删除题目 |
| POST | `/api/questions/reorder` | 更新题目排序 |

## 开发说明

### 添加新功能

1. **新增页面**
```bash
# 创建新的路由页面
mkdir -p src/app/new-page
touch src/app/new-page/page.tsx
```

2. **新增 API 端点**
```bash
# 在 backend/server.js 中添加新的路由
app.get('/api/new-endpoint', async (req, res) => {
  // 处理逻辑
})
```

3. **添加 API 代理**
```bash
# 在 src/app/api/proxy/ 中添加对应的代理路由
mkdir -p src/app/api/proxy/new-endpoint
touch src/app/api/proxy/new-endpoint/route.ts
```

### 数据存储扩展

当前使用 JSON 文件存储数据，生产环境建议迁移到数据库：

#### 选项 1: Supabase（PostgreSQL）
```bash
pnpm add @supabase/supabase-js
```

#### 选项 2: MongoDB Atlas
```bash
pnpm add mongoose
```

#### 选项 3: PlanetScale（MySQL）
```bash
pnpm add @planetscale/database
```

## 常见问题

### Q: 前端部署后无法连接后端？
A: 检查以下几点：
1. 后端是否已部署并正常运行
2. API 代理配置中的 `BACKEND_URL` 是否正确
3. 后端 API 是否允许跨域访问（CORS）

### Q: 数据丢失怎么办？
A: JSON 文件存储不适合生产环境，建议：
1. 定期备份数据文件
2. 迁移到云数据库
3. 实现数据持久化策略

### Q: 如何实现用户认证？
A: 可以使用以下方案：
- NextAuth.js
- Supabase Auth
- Clerk

### Q: 如何优化性能？
A: 推荐以下优化措施：
1. 启用 Next.js 图片优化
2. 实现缓存策略
3. 使用 CDN 加速静态资源
4. 代码分割和懒加载

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请提交 Issue 或联系开发者。
