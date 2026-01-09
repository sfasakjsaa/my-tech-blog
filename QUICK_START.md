# 快速部署指南 - Vercel

## 🎯 5 分钟快速部署

### 步骤 1: 准备 GitHub 仓库（2 分钟）

1. 访问 https://github.com/new 创建新仓库
2. 仓库名建议：`azhen-tech-blog`
3. 点击 "Create repository"

4. 在本地项目目录执行：
```bash
git init
git add .
git commit -m "feat: 阿真个人技术博客"

# 添加远程仓库（替换下面的用户名和仓库名）
git remote add origin https://github.com/你的用户名/azhen-tech-blog.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 2: 在 Vercel 部署（2 分钟）

1. 访问 https://vercel.com/login
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"（添加新项目）
4. 选择刚创建的 `azhen-tech-blog` 仓库
5. 点击 "Import"

### 步骤 3: 配置部署（30 秒）

Vercel 会自动检测 Next.js，默认配置即可：

- ✅ Framework: Next.js
- ✅ Build Command: `pnpm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `pnpm install`

直接点击 **"Deploy"** 按钮

### 步骤 4: 等待部署（1 分钟）

- 构建和部署大约需要 1-2 分钟
- 看到 ✅ "Congratulations" 表示部署成功
- 点击链接访问你的网站：`https://azhen-tech-blog.vercel.app`

## 🎉 完成！

现在你的网站已经上线了！

### 后续操作：

#### 更新网站
```bash
# 修改代码后
git add .
git commit -m "描述你的修改"
git push
# Vercel 会自动重新部署
```

#### 自定义域名（可选）
1. 购买域名
2. 在 Vercel 项目设置 → Domains → 添加域名
3. 配置 DNS 记录

## 📸 部署成功后你会得到：

- ✅ 一个永久可访问的网站 URL
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS 证书
- ✅ 自动持续部署
- ✅ Git 回滚功能

## 💡 提示

- **免费额度**：Vercel 免费计划足够个人使用
- **构建时间**：每次部署约 1-2 分钟
- **预览部署**：每个分支都会自动创建预览 URL

## ❓ 遇到问题？

查看完整文档：`DEPLOYMENT.md`

---

**准备好了吗？开始部署吧！** 🚀
