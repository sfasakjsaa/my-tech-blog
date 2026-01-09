# 🚀 立即部署指南

**当前状态**: ✅ 代码已推送到 GitHub
**仓库地址**: https://github.com/sfasakjsaa/my-tech-blog
**分支**: main

---

## 第一步：部署后端到 Render（建议先做）

### 1.1 登录 Render
1. 访问 https://dashboard.render.com/
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. 使用 GitHub 账户登录（推荐）

### 1.2 创建新的 Web Service
1. 登录后，点击右上角的 **"New +"** 按钮
2. 选择 **"Web Service"**

### 1.3 配置后端服务
在配置页面填写以下信息：

**基本信息**
- **Name**: `azhen-blog-backend`（或你喜欢的名称）
- **Region**: 选择 **Singapore** 或离你最近的区域
- **Runtime**: **Node**

**仓库配置**
- **Repository**: 选择 `my-tech-blog` 仓库
- **Branch**: `main`
- **Root Directory**: 输入 `backend`

**构建和启动**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

**实例类型**
- **Instance Type**: **Free**（免费套餐，足够使用）
- 如果需要更高性能，可以选择付费套餐

### 1.4 设置环境变量
在页面底部的 **"Advanced"** 部分，找到 **"Environment Variables"**，点击 **"Add"** 添加：

```
PORT=8080
NODE_ENV=production
```

### 1.5 创建服务
点击页面底部的 **"Create Web Service"** 按钮

### 1.6 等待部署
- 首次部署大约需要 2-5 分钟
- 你可以在 **"Logs"** 标签页查看部署进度
- 等待状态变为 **"Live"**

### 1.7 记录后端 URL
部署完成后，Render 会提供一个 URL，类似：
```
https://azhen-blog-backend.onrender.com
```

**⚠️ 重要：复制并保存这个 URL，后面配置前端时需要用到！**

### 1.8 测试后端 API
打开浏览器或使用命令行测试：

```bash
# 测试分类 API
curl https://azhen-blog-backend.onrender.com/api/categories

# 测试题目 API
curl https://azhen-blog-backend.onrender.com/api/questions
```

预期返回包含 `success: true` 的 JSON 数据。

---

## 第二步：部署前端到 Netlify

### 2.1 登录 Netlify
1. 访问 https://app.netlify.com/
2. 点击右上角 **"Sign up"** 或 **"Log in"**
3. 使用 GitHub 账户登录

### 2.2 导入 GitHub 仓库
1. 登录后，在首页点击 **"Add new site"** 按钮
2. 选择 **"Import from Git"**

### 2.3 选择仓库
1. 在仓库列表中找到 `my-tech-blog`
2. 点击右侧的 **"Import site"** 按钮

### 2.4 配置构建设置
在配置页面填写以下信息：

**基本配置**
- **Build command**: `pnpm run build`
- **Publish directory**: `.next`

**环境变量（可选）**
在 **"Environment variables"** 部分，点击 **"New variable"** 添加：
```
Key: NEXT_PUBLIC_API_URL
Value: http://localhost:8080
```
*注意：这个值会在连接前后端时更新*

### 2.5 开始部署
点击页面底部的 **"Deploy site"** 按钮

### 2.6 等待部署
- 首次部署大约需要 3-5 分钟
- 查看部署进度
- 等待状态变为 **"Published"**

### 2.7 访问前端
部署完成后，Netlify 会提供一个随机 URL，类似：
```
https://amazing-newton-123456.netlify.app
```

点击这个链接访问你的前端页面！

---

## 第三步：连接前后端

### 3.1 修改 API 代理配置

你需要修改以下 6 个文件中的 `BACKEND_URL`，将其从 `http://localhost:8080` 改为你的 Render 后端 URL。

**文件列表**：
1. `src/app/api/proxy/categories/route.ts`
2. `src/app/api/proxy/categories/[id]/route.ts`
3. `src/app/api/proxy/categories/reorder/route.ts`
4. `src/app/api/proxy/questions/route.ts`
5. `src/app/api/proxy/questions/[id]/route.ts`
6. `src/app/api/proxy/questions/reorder/route.ts`

**修改方法**：

在每个文件中，找到这一行：
```typescript
const BACKEND_URL = 'http://localhost:8080'
```

改为：
```typescript
const BACKEND_URL = 'https://azhen-blog-backend.onrender.com'
```

*注意：将 `azhen-blog-backend.onrender.com` 替换为你的实际后端 URL*

### 3.2 提交并推送修改

在本地执行以下命令：

```bash
# 提交修改
git add .
git commit -m "chore: 更新 API 代理配置，使用生产环境后端 URL"
git push origin main
```

### 3.3 Netlify 自动重新部署
- Netlify 会检测到 GitHub 有新的提交
- 自动触发新的部署
- 等待几分钟后，部署完成

---

## 第四步：验证部署

### 4.1 功能测试
访问你的 Netlify 前端 URL，测试以下功能：

**基本功能**
- ✅ 页面正常加载
- ✅ 分类列表显示
- ✅ 题目列表显示
- ✅ 搜索功能正常
- ✅ 响应式设计（尝试调整浏览器窗口大小）

**CRUD 操作**
- ✅ 创建新分类
- ✅ 编辑分类
- ✅ 删除分类
- ✅ 创建新题目
- ✅ 编辑题目
- ✅ 删除题目

**高级功能**
- ✅ 常考题筛选
- ✅ 分类排序
- ✅ 题目排序

### 4.2 检查浏览器控制台
1. 按 `F12` 打开浏览器开发者工具
2. 切换到 **Console** 标签页
3. 检查是否有错误信息
4. 切换到 **Network** 标签页
5. 查看所有 API 请求是否都返回 200 状态码

### 4.3 移动端测试
1. 使用手机访问前端 URL
2. 测试触摸交互
3. 测试导航菜单
4. 测试所有功能

---

## 第五步：自定义域名（可选）

### 5.1 绑定域名到 Netlify
1. 在 Netlify 控制台，点击 **"Domain settings"**
2. 点击 **"Add custom domain"**
3. 输入你的域名，例如 `blog.yourdomain.com`
4. 按照提示配置 DNS 记录
5. 等待 DNS 生效（通常需要几分钟到几小时）

### 5.2 HTTPS 自动启用
Netlify 会自动为你的域名配置 SSL 证书，无需手动操作。

---

## 📊 部署检查清单

- [ ] 后端部署到 Render，状态为 Live
- [ ] 记录了后端 URL
- [ ] 后端 API 测试通过
- [ ] 前端部署到 Netlify，状态为 Published
- [ ] 修改了 6 个 API 代理文件的 BACKEND_URL
- [ ] 推送了修改到 GitHub
- [ ] Netlify 自动重新部署完成
- [ ] 所有基本功能测试通过
- [ ] 所有 CRUD 操作测试通过
- [ ] 浏览器控制台无错误
- [ ] 移动端测试通过

---

## 🆘 常见问题

### Q: Netlify 部署失败
**A**: 检查以下几点：
1. `package.json` 中的 `build` 命令是否正确
2. `next.config.ts` 配置是否正确
3. 查看 Netlify 的部署日志，找到具体错误

### Q: Render 后端部署失败
**A**: 检查以下几点：
1. `backend/package.json` 中的依赖是否正确
2. `backend/Procfile` 文件是否存在且内容正确
3. 查看部署日志，找到具体错误

### Q: 前端无法连接后端
**A**: 检查以下几点：
1. 后端服务是否正常运行（在 Render 控制台查看状态）
2. API 代理配置中的 `BACKEND_URL` 是否正确
3. 后端 API URL 是否可以从外部访问（使用 curl 测试）

### Q: API 请求失败，返回 404
**A**: 检查以下几点：
1. API 路径是否正确
2. 后端路由是否正确配置
3. 查看后端日志，确认请求是否到达

### Q: 数据丢失
**A**:
1. Render 免费套餐会重启服务，但数据文件会保留
2. 生产环境建议迁移到云数据库（如 Supabase）
3. 定期备份数据文件

---

## 🎉 部署完成！

恭喜！你的个人博客系统已经成功部署到线上！

**访问地址**：
- 前端：你的 Netlify URL
- 后端：你的 Render URL

**下一步**：
1. 保存好你的 URL 和登录信息
2. 开始创建你的第一个分类和题目
3. 分享你的博客给朋友！

**需要帮助？**
- 查看 [README.md](./README.md)
- 查看 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 提交 GitHub Issue

---

**祝你部署顺利！** 🚀
