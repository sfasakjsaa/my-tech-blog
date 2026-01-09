#!/bin/bash

# 部署验证脚本
# 用于验证部署环境和配置是否正确

echo "=================================="
echo "部署验证脚本"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_header() {
    echo ""
    echo -e "${BLUE}$1${NC}"
    echo "-----------------------------------"
}

# 1. 检查文件完整性
print_header "1. 检查文件完整性"

files_ok=true

# 检查前端文件
frontend_files=(
    "src/app/page.tsx"
    "src/app/layout.tsx"
    "src/lib/api.ts"
    "src/components/RichTextEditor.tsx"
    "src/components/ConfirmDialog.tsx"
    "src/components/AlertModal.tsx"
    "package.json"
    "next.config.ts"
    "tsconfig.json"
    "tailwind.config.ts"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file 缺失"
        files_ok=false
    fi
done

# 检查后端文件
backend_files=(
    "backend/server.js"
    "backend/package.json"
    "backend/Procfile"
    "backend/.env.example"
    "backend/data/categories.json"
    "backend/data/questions.json"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file 缺失"
        files_ok=false
    fi
done

# 检查配置文件
config_files=(
    "netlify.toml"
    ".env.example"
    ".gitignore"
    "deploy.sh"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file 缺失"
        files_ok=false
    fi
done

if [ "$files_ok" = true ]; then
    print_success "所有必需文件存在"
else
    print_error "部分文件缺失"
fi

echo ""

# 2. 检查依赖
print_header "2. 检查依赖"

if [ -d "node_modules" ]; then
    print_success "前端依赖已安装"
else
    print_warning "前端依赖未安装"
fi

if [ -d "backend/node_modules" ]; then
    print_success "后端依赖已安装"
else
    print_warning "后端依赖未安装"
fi

echo ""

# 3. 检查 TypeScript 编译
print_header "3. 检查 TypeScript 编译"

if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    print_error "TypeScript 编译有错误"
    npx tsc --noEmit 2>&1 | grep "error TS" | head -5
else
    print_success "TypeScript 编译通过"
fi

echo ""

# 4. 检查服务运行状态
print_header "4. 检查服务运行状态"

if curl -s http://localhost:5000 > /dev/null 2>&1; then
    print_success "前端服务运行中 (http://localhost:5000)"
else
    print_warning "前端服务未运行"
fi

if curl -s http://localhost:8080/api/categories > /dev/null 2>&1; then
    print_success "后端服务运行中 (http://localhost:8080)"
else
    print_warning "后端服务未运行"
fi

echo ""

# 5. 检查 API 代理
print_header "5. 检查 API 代理"

if curl -s http://localhost:5000/api/proxy/categories > /dev/null 2>&1; then
    print_success "API 代理正常工作"
else
    print_warning "API 代理未测试（前端服务未运行）"
fi

echo ""

# 6. 检查数据完整性
print_header "6. 检查数据完整性"

if [ -f "backend/data/categories.json" ]; then
    if command -v python3 &> /dev/null; then
        cat_count=$(python3 -c "import json; data=json.load(open('backend/data/categories.json')); print(len(data))" 2>/dev/null)
        if [ $? -eq 0 ]; then
            print_success "分类数据正常 ($cat_count 个分类)"
        else
            print_warning "分类数据可能损坏"
        fi
    else
        print_warning "无法验证分类数据（python3 未安装）"
    fi
fi

if [ -f "backend/data/questions.json" ]; then
    if command -v python3 &> /dev/null; then
        q_count=$(python3 -c "import json; data=json.load(open('backend/data/questions.json')); print(len(data))" 2>/dev/null)
        if [ $? -eq 0 ]; then
            print_success "题目数据正常 ($q_count 个题目)"
        else
            print_warning "题目数据可能损坏"
        fi
    else
        print_warning "无法验证题目数据（python3 未安装）"
    fi
fi

echo ""

# 7. 检查部署配置
print_header "7. 检查部署配置"

if [ -f "netlify.toml" ] && grep -q "build" netlify.toml; then
    print_success "Netlify 配置正常"
else
    print_warning "Netlify 配置可能有问题"
fi

if [ -f "backend/Procfile" ] && grep -q "node server.js" backend/Procfile; then
    print_success "Render 配置正常"
else
    print_warning "Render 配置可能有问题"
fi

echo ""

# 8. 检查 Git 状态
print_header "8. 检查 Git 状态"

if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "Git 仓库已初始化"

    if git diff --quiet && git diff --cached --quiet; then
        print_success "工作区干净，无未提交的更改"
    else
        print_warning "存在未提交的更改"
        print_info "建议在部署前提交更改"
    fi
else
    print_warning "Git 仓库未初始化"
    print_info "建议初始化 Git 仓库：git init"
fi

echo ""

# 9. 检查文档完整性
print_header "9. 检查文档完整性"

doc_files=(
    "README.md"
    "QUICKSTART.md"
    "DEPLOYMENT_CHECKLIST.md"
    "PROJECT_STATUS.md"
)

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_warning "$file 缺失"
    fi
done

echo ""

# 10. 总结
print_header "10. 验证总结"

if [ "$files_ok" = true ]; then
    print_success "✅ 项目准备就绪，可以部署！"
    echo ""
    print_info "下一步操作："
    echo "  1. 提交代码到 Git"
    echo "  2. 推送到 GitHub"
    echo "  3. 按照 DEPLOYMENT_CHECKLIST.md 部署"
    echo ""
    print_info "快速部署命令："
    echo "  ./deploy.sh"
else
    print_warning "⚠️ 项目未完全就绪，请先修复上述问题"
fi

echo ""
echo "=================================="
echo "验证完成"
echo "=================================="
