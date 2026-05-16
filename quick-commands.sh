#!/bin/bash

# ========================================
# Cloudflare Pages + D1 快速命令参考
# ========================================

# 显示帮助
show_help() {
    cat << EOF
Cloudflare Pages + D1 博客项目命令参考

使用方法:
    bash quick-commands.sh [命令]

可用命令:
    install      安装依赖
    init-db      初始化数据库
    dev          本地开发
    deploy       部署到生产环境
    test-api     测试 API
    logs         查看部署日志
    clean        清理本地构建

示例:
    bash quick-commands.sh install
    bash quick-commands.sh dev
    bash quick-commands.sh deploy

EOF
}

# 安装依赖
install_deps() {
    echo "📦 安装依赖..."
    npm install
    echo "✅ 依赖安装完成"
}

# 初始化数据库
init_database() {
    echo "📊 初始化数据库..."
    echo "⚠️  请确保 D1 数据库已创建"
    read -p "继续？(y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql --remote
        echo "✅ 数据库初始化完成"
    else
        echo "已取消"
    fi
}

# 本地开发
start_dev() {
    echo "🔧 启动本地开发服务器..."
    echo "按 Ctrl+C 停止"
    wrangler pages dev .
}

# 部署
deploy_project() {
    echo "🚀 部署到 Cloudflare Pages..."
    
    read -p "是否先初始化数据库？(y/N): " init
    if [ "$init" = "y" ] || [ "$init" = "Y" ]; then
        bash quick-commands.sh init-db
    fi
    
    npm run deploy
    echo "✅ 部署完成"
}

# 测试 API
test_api() {
    echo "🧪 测试 API..."
    echo ""
    
    echo "1. 测试 GET /api/index"
    echo "   curl https://yy8-blog.pages.dev/api/index"
    echo ""
    
    echo "2. 测试 POST /api/index"
    echo '   curl -X POST https://yy8-blog.pages.dev/api/index \'
    echo '     -H "Content-Type: application/json" \'
    echo '     -d {"title":"测试","content":"内容"}'
    echo ""
    
    read -p "是否执行实际测试？(y/N): " test
    if [ "$test" = "y" ] || [ "$test" = "Y" ]; then
        echo ""
        echo "执行 GET 测试..."
        curl -s https://yy8-blog.pages.dev/api/index | head -c 500
        echo ""
    fi
}

# 查看日志
view_logs() {
    echo "📜 查看部署日志..."
    wrangler pages deployment tail yy8-blog
}

# 清理
clean_build() {
    echo "🧹 清理构建..."
    rm -rf .cloudflare
    echo "✅ 清理完成"
}

# 主逻辑
case "${1:-help}" in
    install)
        install_deps
        ;;
    init-db)
        init_database
        ;;
    dev)
        start_dev
        ;;
    deploy)
        deploy_project
        ;;
    test-api)
        test_api
        ;;
    logs)
        view_logs
        ;;
    clean)
        clean_build
        ;;
    help|*)
        show_help
        ;;
esac
