#!/bin/bash

echo "======================================"
echo "Cloudflare Pages 快速部署脚本"
echo "======================================"
echo ""

# 检查依赖
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler 未安装"
    echo "请运行: npm install -g wrangler"
    exit 1
fi

# 检查 wrangler.toml
if [ ! -f "wrangler.toml" ]; then
    echo "❌ wrangler.toml 文件不存在"
    exit 1
fi

echo "✅ 检查依赖完成"
echo ""

# 显示当前配置
echo "📋 当前配置："
echo "  - 项目名称: $(grep '^name' wrangler.toml | cut -d'=' -f2 | tr -d ' "')"
echo "  - 数据库绑定: $(grep -A3 'd1_databases' wrangler.toml | grep 'binding' | cut -d'=' -f2 | tr -d ' "')"
echo "  - 数据库名称: $(grep -A3 'd1_databases' wrangler.toml | grep 'database_name' | cut -d'=' -f2 | tr -d ' "')"
echo ""

# 检查 D1 数据库
echo "🔍 检查 D1 数据库..."
DATABASE_ID=$(grep -A3 'd1_databases' wrangler.toml | grep 'database_id' | cut -d'=' -f2 | tr -d ' "')
if [ -z "$DATABASE_ID" ]; then
    echo "⚠️  未找到数据库 ID，准备创建新数据库..."
    
    read -p "请输入数据库名称 (blog_db): " DB_NAME
    DB_NAME=${DB_NAME:-blog_db}
    
    echo "📦 创建 D1 数据库..."
    wrangler d1 create $DB_NAME
    
    echo ""
    echo "⚠️  请将返回的 database_id 添加到 wrangler.toml"
    echo "   然后重新运行此脚本"
    exit 1
fi

echo "✅ 数据库 ID: $DATABASE_ID"
echo ""

# 初始化数据库
read -p "是否初始化数据库表？(y/N): " INIT_DB
if [ "$INIT_DB" = "y" ] || [ "$INIT_DB" = "Y" ]; then
    echo "📊 初始化数据库表..."
    wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql --remote
    echo "✅ 数据库表初始化完成"
    echo ""
fi

# 部署
read -p "是否部署到 Cloudflare Pages？(y/N): " DEPLOY
if [ "$DEPLOY" = "y" ] || [ "$DEPLOY" = "Y" ]; then
    echo "🚀 开始部署..."
    echo ""
    
    # 本地测试（可选）
    read -p "是否先本地测试？(y/N): " LOCAL_TEST
    if [ "$LOCAL_TEST" = "y" ] || [ "$LOCAL_TEST" = "Y" ]; then
        echo "🔧 启动本地服务器..."
        echo "按 Ctrl+C 停止本地测试"
        echo ""
        wrangler pages dev .
    fi
    
    echo "📤 部署到 Cloudflare Pages..."
    wrangler pages deploy . --project-name=yy8-blog
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 部署成功！"
        echo ""
        echo "测试 API："
        echo "  - GET:    curl https://yy8-blog.pages.dev/api/index"
        echo "  - POST:   curl -X POST https://yy8-blog.pages.dev/api/index \\"
        echo "              -H 'Content-Type: application/json' \\"
        echo "              -d '{\"title\":\"测试\",\"content\":\"内容\"}'"
        echo ""
    else
        echo "❌ 部署失败"
        exit 1
    fi
else
    echo "跳过部署"
fi

echo ""
echo "======================================"
echo "完成！"
echo "======================================"
