# 部署指南

## 🚀 部署到 Netlify（推荐）

Netlify 是一个功能强大的静态网站托管平台，支持 Next.js 的服务端渲染。

### 第一步：注册账号

1. 访问 https://www.netlify.com
2. 使用 GitHub、GitLab 或 Bitbucket 账号登录

### 第二步：推送代码到 GitHub

1. 在 GitHub 上创建一个新仓库
2. 初始化本地 git（如果还没有）：
```bash
git init
git add .
git commit -m "Initial commit"
```

3. 添加远程仓库并推送：
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 第三步：在 Netlify 导入项目

1. 登录 Netlify 后，点击 "Add new site" → "Import an existing project"
2. 选择 GitHub 作为持续部署提供商
3. 授权 Netlify 访问你的 GitHub 仓库
4. 选择你要部署的仓库

### 第四步：配置构建设置

Netlify 通常会自动检测 Next.js 项目，但你需要确认以下配置：

- **Build command**: `pnpm run build`
- **Publish directory**: `.next`
- **Node version**: `18`

如果自动检测失败，可以手动在 "Site settings" → "Build & deploy" 中配置。

### 第五步：点击部署

1. 点击 "Deploy site" 按钮
2. Netlify 会自动构建和部署
3. 大约 2-3 分钟即可完成
4. 部署成功后，你会获得一个 `.netlify.app` 域名

### 第六步：配置环境变量（如果需要）

如果项目需要环境变量（如数据库连接），在 Netlify 项目设置中添加：

1. 进入项目 → Site settings → Environment variables
2. 点击 "Add a variable"
3. 添加所需的环境变量：
   - `DATABASE_URL`: 数据库连接字符串
   - `S3_BUCKET_NAME`: S3 存储桶名称
   - `S3_ACCESS_KEY_ID`: S3 访问密钥
   - `S3_SECRET_ACCESS_KEY`: S3 密钥
   - `S3_ENDPOINT`: S3 服务端点（如果不是 AWS）
   - 等等...

4. 点击 "Save"
5. 重新部署项目（触发新的构建）

## 🌟 自定义域名（可选）

### 免费域名
Netlify 会提供免费域名：`your-project.netlify.app`

### 使用自己的域名
1. 购买域名（如阿里云、腾讯云、Namecheap 等）
2. 在 Netlify 项目设置中 → Domain management → Add custom domain
3. 输入你的域名并按照提示配置 DNS 记录
4. Netlify 会自动配置 SSL 证书（Let's Encrypt）

## 📊 部署特性

- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 自动持续部署（推送代码自动部署）
- ✅ 预览部署（每个 Pull Request 自动预览）
- ✅ Serverless Functions 支持
- ✅ 表单处理
- ✅ 免费额度充足

## 🔄 更新项目

部署后，只需：
1. 修改代码
2. 提交到 GitHub
3. Netlify 自动检测并重新部署

## 📝 注意事项

- Netlify 免费计划支持：
  - 每月 100GB 带宽
  - 每月 300 分钟构建时间
  - 无限站点
  - 无限 HTTP/HTTPS 请求

- 如果项目使用数据库，建议使用：
  - Supabase（免费）
  - Neon（PostgreSQL，免费）
  - Railway（PostgreSQL，免费）

- Next.js 在 Netlify 上需要使用 `@netlify/plugin-nextjs` 插件，项目已配置在 `netlify.toml` 中

## ❓ 常见问题

### Q: 部署失败怎么办？
A: 检查 Netlify 部署日志，点击具体部署 → Deploy log 查看错误信息

### Q: 如何查看部署日志？
A: 在 Netlify 项目页面 → Deploys → 点击具体部署 → 查看 Deploy log

### Q: 如何回滚到之前版本？
A: 在 Netlify 项目页面 → Deploys → 找到之前的部署 → 点击 "Publish deploy"

### Q: 如何设置域名？
A: 在 Netlify 项目设置 → Domain management → Add custom domain

### Q: Next.js API 路由如何工作？
A: Netlify 的 Next.js 插件会自动将 API 路由转换为 Netlify Functions，无需额外配置

### Q: 如何配置环境变量？
A: 在 Site settings → Environment variables 中添加，区分 "Build" 和 "Development" 环境

## 🚀 使用 Netlify CLI（可选）

如果你更喜欢命令行操作，可以安装 Netlify CLI：

```bash
# 全局安装 Netlify CLI
pnpm add -g netlify-cli

# 登录
netlify login

# 初始化项目
netlify init

# 手动部署
netlify deploy --prod
```

## 📚 更多资源

- Netlify 官方文档：https://docs.netlify.com
- Netlify Next.js 集成：https://docs.netlify.com/integrations/frameworks/nextjs/
- Next.js 部署指南：https://nextjs.org/docs/deployment
