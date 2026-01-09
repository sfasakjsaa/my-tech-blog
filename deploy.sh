#!/bin/bash

# 阿真个人技术博客 - 快速部署脚本

echo "=================================="
echo "阿真个人技术博客 - 部署助手"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# 1. 检查环境
echo "1. 检查环境..."
echo "-----------------------------------"

if ! command_exists node; then
    print_error "Node.js 未安装，请先安装 Node.js"
    exit 1
fi
print_success "Node.js 已安装"

if ! command_exists pnpm; then
    print_error "pnpm 未安装，请先安装 pnpm"
    print_info "安装命令: npm install -g pnpm"
    exit 1
fi
print_success "pnpm 已安装"

echo ""

# 2. 安装前端依赖
echo "2. 安装前端依赖..."
echo "-----------------------------------"
if [ ! -d "node_modules" ]; then
    print_info "正在安装前端依赖..."
    pnpm install
    if [ $? -eq 0 ]; then
        print_success "前端依赖安装完成"
    else
        print_error "前端依赖安装失败"
        exit 1
    fi
else
    print_success "前端依赖已存在"
fi
echo ""

# 3. 安装后端依赖
echo "3. 安装后端依赖..."
echo "-----------------------------------"
cd backend
if [ ! -d "node_modules" ]; then
    print_info "正在安装后端依赖..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "后端依赖安装完成"
    else
        print_error "后端依赖安装失败"
        exit 1
    fi
else
    print_success "后端依赖已存在"
fi
cd ..
echo ""

# 4. 初始化数据文件
echo "4. 初始化数据文件..."
echo "-----------------------------------"
mkdir -p backend/data

if [ ! -f "backend/data/categories.json" ]; then
    print_info "创建 categories.json..."
    echo '[]' > backend/data/categories.json
    print_success "categories.json 创建完成"
else
    print_success "categories.json 已存在"
fi

if [ ! -f "backend/data/questions.json" ]; then
    print_info "创建 questions.json..."
    echo '[]' > backend/data/questions.json
    print_success "questions.json 创建完成"
else
    print_success "questions.json 已存在"
fi
echo ""

# 5. 检查配置文件
echo "5. 检查配置文件..."
echo "-----------------------------------"

config_files=(
    "netlify.toml"
    "backend/Procfile"
    "backend/.env.example"
)

all_config_ok=true
for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file 存在"
    else
        print_error "$file 不存在"
        all_config_ok=false
    fi
done

if [ "$all_config_ok" = false ]; then
    print_warning "部分配置文件缺失，请检查"
fi
echo ""

# 6. 构建测试
echo "6. 构建测试..."
echo "-----------------------------------"
print_info "开始构建前端..."
pnpm run build
if [ $? -eq 0 ]; then
    print_success "前端构建成功"
else
    print_error "前端构建失败"
    exit 1
fi
echo ""

# 7. 本地测试
echo "7. 本地测试..."
echo "-----------------------------------"
print_warning "是否启动本地测试？(y/n)"
read -r response

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    print_info "启动后端服务..."
    cd backend
    node server.js > /tmp/backend-test.log 2>&1 &
    BACKEND_PID=$!
    cd ..

    sleep 2

    if curl -s http://localhost:8080/api/categories > /dev/null; then
        print_success "后端服务启动成功"
    else
        print_error "后端服务启动失败"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi

    print_info "启动前端服务..."
    pnpm run dev > /tmp/frontend-test.log 2>&1 &
    FRONTEND_PID=$!

    sleep 3

    if curl -s http://localhost:5000 > /dev/null; then
        print_success "前端服务启动成功"
    else
        print_error "前端服务启动失败"
        kill $BACKEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
        exit 1
    fi

    echo ""
    print_success "本地测试环境已启动"
    print_info "前端: http://localhost:5000"
    print_info "后端: http://localhost:8080"
    print_info "按 Ctrl+C 停止服务"

    # 等待用户停止
    wait

    # 清理
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
fi
echo ""

# 8. 部署指南
echo "=================================="
echo "部署准备完成！"
echo "=================================="
echo ""
print_info "下一步操作："
echo ""
echo "1️⃣  将代码推送到 GitHub"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2️⃣  部署前端到 Netlify"
echo "   访问: https://app.netlify.com/"
echo "   点击 'Add new site' → 'Import from Git'"
echo "   选择你的 GitHub 仓库"
echo "   配置: Build command: pnpm run build"
echo "   配置: Publish directory: .next"
echo ""
echo "3️⃣  部署后端到 Render"
echo "   访问: https://dashboard.render.com/"
echo "   点击 'New+' → 'Web Service'"
echo "   选择你的 GitHub 仓库"
echo "   Root Directory: backend"
echo "   Build Command: npm install"
echo "   Start Command: node server.js"
echo ""
echo "4️⃣  连接前后端"
echo "   更新 src/app/api/proxy/*/route.ts 中的 BACKEND_URL"
echo "   重新部署前端"
echo ""
echo "📄  详细部署指南: DEPLOYMENT_CHECKLIST.md"
echo "📄  项目文档: README.md"
echo ""
print_success "所有检查完成，可以开始部署了！"
