#!/bin/bash

# Azhen Blog Backend 部署脚本

echo "=================================="
echo "Azhen Blog Backend 部署脚本"
echo "=================================="
echo ""

# 检查 Java 是否安装
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未安装 Java"
    echo "请先安装 Java 17 或更高版本"
    exit 1
fi

# 检查 Java 版本
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "✅ Java 版本: $JAVA_VERSION"

# 检查 Maven 是否安装
if ! command -v mvn &> /dev/null; then
    echo "❌ 错误: 未安装 Maven"
    echo "请先安装 Maven"
    exit 1
fi

echo "✅ Maven 版本: $(mvn -version | head -1)"
echo ""

# 检查 MySQL 连接
echo "检查 MySQL 连接..."
read -p "MySQL 主机 (默认: localhost): " MYSQL_HOST
MYSQL_HOST=${MYSQL_HOST:-localhost}

read -p "MySQL 端口 (默认: 3306): " MYSQL_PORT
MYSQL_PORT=${MYSQL_PORT:-3306}

read -p "MySQL 用户名 (默认: root): " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-root}

read -s -p "MySQL 密码: " MYSQL_PASSWORD
echo ""

# 测试数据库连接
if command -v mysql &> /dev/null; then
    if mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1" &> /dev/null; then
        echo "✅ 数据库连接成功"
    else
        echo "❌ 错误: 无法连接到数据库"
        echo "请检查数据库配置"
        exit 1
    fi
else
    echo "⚠️  警告: 未安装 mysql 客户端，跳过连接测试"
fi

echo ""
echo "配置数据库连接..."

# 备份原配置文件
if [ -f "src/main/resources/application.properties" ]; then
    cp src/main/resources/application.properties src/main/resources/application.properties.bak
    echo "✅ 已备份原配置文件"
fi

# 更新配置文件
cat > src/main/resources/application.properties << EOF
# Server Configuration
server.port=8080
spring.application.name=azhen-blog-backend

# Database Configuration
spring.datasource.url=jdbc:mysql://$MYSQL_HOST:$MYSQL_PORT/azhen_blog?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=$MYSQL_USER
spring.datasource.password=$MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

# Logging
logging.level.com.azhen.blog=DEBUG
logging.level.org.springframework.web=INFO
logging.level.org.hibernate.SQL=DEBUG

# CORS Configuration (allow all origins for development)
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
EOF

echo "✅ 配置文件已更新"
echo ""

# 创建数据库（如果不存在）
echo "创建数据库（如果不存在）..."
if command -v mysql &> /dev/null; then
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS azhen_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "✅ 数据库创建成功"
else
    echo "⚠️  警告: 请手动创建数据库 azhen_blog"
fi

echo ""
echo "开始构建项目..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "✅ 构建成功"
echo ""

# 询问是否启动服务
read -p "是否立即启动服务? (y/n): " START_SERVICE
if [ "$START_SERVICE" = "y" ] || [ "$START_SERVICE" = "Y" ]; then
    echo ""
    echo "启动服务..."
    java -jar target/blog-backend-1.0.0.jar
else
    echo ""
    echo "部署完成！"
    echo ""
    echo "使用以下命令启动服务:"
    echo "  java -jar target/blog-backend-1.0.0.jar"
    echo ""
    echo "或者使用 Maven:"
    echo "  mvn spring-boot:run"
    echo ""
    echo "服务将在 http://localhost:8080 启动"
fi
