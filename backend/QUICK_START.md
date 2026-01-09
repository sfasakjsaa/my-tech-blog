# 快速开始指南

## 本地开发环境设置

### 第一步：安装 MySQL

**选项 1: 使用 Docker（推荐）**
```bash
# 拉取 MySQL 镜像
docker pull mysql:8

# 启动 MySQL 容器
docker run --name azhen-mysql \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=azhen_blog \
  -p 3306:3306 \
  -d mysql:8

# 验证容器是否运行
docker ps | grep azhen-mysql
```

**选项 2: 本地安装 MySQL**
- macOS: `brew install mysql`
- Ubuntu: `sudo apt install mysql-server`
- Windows: 下载并安装 [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

### 第二步：安装 Java 和 Maven

**检查是否已安装**
```bash
java -version
mvn -version
```

**如果没有安装，请安装：**
- macOS: `brew install openjdk@17 maven`
- Ubuntu: `sudo apt install openjdk-17-jdk maven`
- Windows: 下载并安装 [JDK 17](https://adoptium.net/) 和 [Maven](https://maven.apache.org/download.cgi)

### 第三步：启动后端服务

**使用部署脚本（推荐）**
```bash
cd backend
./deploy.sh
```

**或者手动启动**
```bash
cd backend

# 编辑配置文件
vim src/main/resources/application.properties

# 修改数据库连接信息
# spring.datasource.url=jdbc:mysql://localhost:3306/azhen_blog
# spring.datasource.username=root
# spring.datasource.password=yourpassword

# 启动服务
mvn spring-boot:run
```

### 第四步：测试 API

**使用测试脚本**
```bash
./test-api.sh
```

**或者手动测试**
```bash
# 测试获取分类
curl http://localhost:8080/api/categories

# 测试创建分类
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"测试分类","order":"1"}'

# 测试获取题目
curl http://localhost:8080/api/questions
```

### 第五步：配置前端

在前端项目根目录创建 `.env.local` 文件：
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

启动前端：
```bash
npm run dev
```

访问 http://localhost:3000

---

## 生产环境部署

### 选项 1: 部署到 Render

1. **准备代码**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **在 Render 上创建服务**
   - 访问 https://render.com
   - 点击 "New" → "Web Service"
   - 连接你的 GitHub 仓库
   - 配置构建命令：`mvn clean package -DskipTests`
   - 配置启动命令：`java -jar target/blog-backend-1.0.0.jar`
   - 添加环境变量：
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://your-host:3306/azhen_blog`
     - `SPRING_DATASOURCE_USERNAME`: `your-username`
     - `SPRING_DATASOURCE_PASSWORD`: `your-password`

3. **部署并获取 URL**
   - 点击 "Deploy"
   - 等待部署完成
   - 记下 Render 提供的 URL，例如：`https://azhen-blog-backend.onrender.com`

### 选项 2: 部署到 Railway

1. **创建数据库**
   - 在 Railway Dashboard 点击 "New Project"
   - 点击 "Provision" → "Add Database"
   - 选择 "MySQL"

2. **创建后端服务**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库
   - 配置环境变量（同上）
   - 点击 "Deploy"

3. **获取 URL**
   - 部署完成后，Railway 会提供公网 URL

### 选项 3: 部署到自己的服务器

**1. 准备服务器**
```bash
# 安装 Java 和 Maven
sudo apt update
sudo apt install openjdk-17-jdk maven

# 安装 MySQL（如果还没有）
sudo apt install mysql-server
sudo mysql_secure_installation
```

**2. 克隆代码**
```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo/backend
```

**3. 配置并启动**
```bash
# 运行部署脚本
./deploy.sh
```

**4. 使用 systemd 管理服务**
```bash
# 复制服务文件
sudo cp blog-backend.service /etc/systemd/system/

# 编辑服务文件（修改数据库密码等）
sudo vim /etc/systemd/system/blog-backend.service

# 启用并启动服务
sudo systemctl enable blog-backend
sudo systemctl start blog-backend

# 查看服务状态
sudo systemctl status blog-backend

# 查看日志
sudo journalctl -u azhen-blog-backend -f
```

---

## 常见问题

### 问题 1: 端口 8080 被占用

**解决方案：修改端口**

修改 `application.properties`:
```properties
server.port=8888
```

### 问题 2: 数据库连接失败

**检查清单：**
- MySQL 是否正在运行？
- 数据库用户名和密码是否正确？
- 防火墙是否允许连接？
- 数据库 `azhen_blog` 是否已创建？

**测试数据库连接：**
```bash
mysql -h localhost -u root -p
```

### 问题 3: Flyway 迁移失败

**查看迁移历史：**
```bash
mvn flyway:info
```

**清理并重新创建数据库（仅限开发环境）：**
```bash
mvn flyway:clean
mvn flyway:migrate
```

### 问题 4: 前端无法连接到后端

**检查事项：**
- 后端是否正在运行？
- 前端 `.env.local` 中的 `NEXT_PUBLIC_API_URL` 是否正确？
- CORS 配置是否正确？
- 防火墙是否阻止了连接？

**测试后端是否可访问：**
```bash
curl http://localhost:8080/api/categories
```

---

## 下一步

1. ✅ 完成本地开发环境设置
2. ✅ 测试所有 API 接口
3. ✅ 前后端联调
4. ✅ 部署到生产环境
5. ✅ 配置域名和 SSL 证书

---

## 需要帮助？

- 查看 [README.md](./README.md) 了解更多详细信息
- 查看 [application.properties](./src/main/resources/application.properties) 了解配置选项
- 查看数据库迁移脚本：`src/main/resources/db/migration/`
