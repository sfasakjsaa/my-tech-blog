# Azhen Blog Backend - Spring Boot + MySQL

这是 Azhen 个人技术博客的后端服务，使用 Spring Boot + MySQL 构建。

## 技术栈

- **后端框架**: Spring Boot 3.2.1
- **数据库**: MySQL 8+
- **ORM**: Spring Data JPA (Hibernate)
- **数据库迁移**: Flyway
- **构建工具**: Maven

## 项目结构

```
backend/
├── src/
│   └── main/
│       ├── java/com/azhen/blog/
│       │   ├── BlogBackendApplication.java     # 主应用程序类
│       │   ├── config/                          # 配置类
│       │   │   └── CorsConfig.java             # CORS 配置
│       │   ├── controller/                       # 控制器层
│       │   │   ├── CategoryController.java      # 分类 API
│       │   │   └── QuestionController.java      # 题目 API
│       │   ├── dto/                             # 数据传输对象
│       │   │   ├── ApiResponse.java             # 统一响应格式
│       │   │   ├── CategoryDTO.java
│       │   │   └── QuestionDTO.java
│       │   ├── entity/                          # 实体类
│       │   │   ├── Category.java
│       │   │   └── Question.java
│       │   ├── repository/                      # 数据访问层
│       │   │   ├── CategoryRepository.java
│       │   │   └── QuestionRepository.java
│       │   └── service/                         # 业务逻辑层
│       │       ├── CategoryService.java
│       │       └── QuestionService.java
│       └── resources/
│           ├── application.properties           # 应用配置
│           └── db/migration/                     # 数据库迁移脚本
│               ├── V1__Create_categories_table.sql
│               └── V2__Create_questions_table.sql
└── pom.xml                                       # Maven 配置
```

## API 接口

### 分类管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| POST | `/api/categories` | 创建分类 |
| PUT | `/api/categories/{id}` | 更新分类 |
| DELETE | `/api/categories/{id}` | 删除分类 |

### 题目管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/questions` | 获取题目列表（支持 categoryId 和 search 参数） |
| POST | `/api/questions` | 创建题目 |
| PUT | `/api/questions/{id}` | 更新题目 |
| DELETE | `/api/questions/{id}` | 删除题目 |

## 快速开始

### 1. 安装 MySQL

**使用 Docker（推荐）**:
```bash
docker run --name azhen-mysql \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=azhen_blog \
  -p 3306:3306 \
  -d mysql:8
```

**或者本地安装 MySQL 8+**

### 2. 配置数据库连接

修改 `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/azhen_blog?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### 3. 运行项目

**使用 Maven**:
```bash
cd backend
mvn spring-boot:run
```

**或者先打包再运行**:
```bash
mvn clean package
java -jar target/blog-backend-1.0.0.jar
```

### 4. 访问 API

后端服务将在 `http://localhost:8080` 启动

- 测试分类 API: `http://localhost:8080/api/categories`
- 测试题目 API: `http://localhost:8080/api/questions`

## 部署选项

### 选项 1: 部署到 Render

1. 将代码推送到 GitHub
2. 在 [Render](https://render.com) 创建新服务
3. 选择 "Web Service"
4. 连接你的 GitHub 仓库
5. 配置环境变量：
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://your-host:3306/azhen_blog`
   - `SPRING_DATASOURCE_USERNAME`: `your-username`
   - `SPRING_DATASOURCE_PASSWORD`: `your-password`
6. 点击 "Deploy"

### 选项 2: 部署到 Railway

1. 在 [Railway](https://railway.app) 创建新项目
2. 添加 PostgreSQL 数据库
3. 添加新服务，选择 "Deploy from GitHub repo"
4. 配置环境变量（同上）
5. 点击 "Deploy"

### 选项 3: 部署到自己的服务器

```bash
# 在服务器上安装 Java 17 和 Maven
sudo apt update
sudo apt install openjdk-17-jdk maven

# 克隆代码
git clone <your-repo-url>
cd backend

# 配置 application.properties
vim src/main/resources/application.properties

# 运行
mvn spring-boot:run

# 或者使用 systemd 服务（生产环境推荐）
sudo cp blog-backend.service /etc/systemd/system/
sudo systemctl enable blog-backend
sudo systemctl start blog-backend
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `SPRING_DATASOURCE_URL` | 数据库 URL | `jdbc:mysql://localhost:3306/azhen_blog` |
| `SPRING_DATASOURCE_USERNAME` | 数据库用户名 | `root` |
| `SPRING_DATASOURCE_PASSWORD` | 数据库密码 | `yourpassword` |
| `SERVER_PORT` | 服务端口 | `8080` |

## 前端配置

前端（Next.js）需要修改 API 调用地址，指向后端服务的 URL。

在 Next.js 中创建 `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

或者在部署到生产环境时:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

然后在代码中使用:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
fetch(`${API_URL}/api/categories`)
```

## 数据库管理

### 查看 Flyway 迁移历史
```bash
mvn flyway:info
```

### 手动执行数据库迁移
```bash
mvn flyway:migrate
```

### 清理并重新创建数据库（开发环境）
```bash
mvn flyway:clean
mvn flyway:migrate
```

## 开发说明

### 添加新的 API 接口

1. 在 `controller/` 创建新的 Controller 类
2. 在 `service/` 创建对应的 Service 类
3. 在 `repository/` 创建对应的 Repository 接口（如果需要）
4. 在 `entity/` 创建对应的实体类（如果需要）

### 添加新的数据库表

1. 在 `src/main/resources/db/migration/` 创建新的 SQL 文件
2. 文件命名格式：`V{版本号}__{描述}.sql`
3. 例如：`V3__Create_new_table.sql`

## 故障排查

### 问题：无法连接到数据库
- 检查 MySQL 是否正在运行
- 检查数据库连接配置是否正确
- 确认数据库用户名和密码
- 检查防火墙设置

### 问题：Flyway 迁移失败
- 查看 Flyway 迁移历史：`mvn flyway:info`
- 检查迁移 SQL 语法是否正确
- 如需修复，可以手动修复数据库后调整 Flyway 版本

### 问题：API 返回 500 错误
- 查看应用日志
- 检查数据库表是否存在
- 确认 Flyway 迁移是否成功执行

## 许可证

MIT
