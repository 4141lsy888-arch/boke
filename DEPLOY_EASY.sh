#!/bin/bash
echo "===================================="
echo "   ✨ 一键部署到 Cloudflare ✨"
echo "===================================="
echo ""
cd "$(dirname "$0")"

echo "📦 Step 1: 进入 Cloudflare Worker 目录..."
cd cloudflare-worker

echo ""
echo "🔑 Step 2: 登录 Cloudflare..."
echo "   浏览器会自动打开，请点击 'Authorize'（授权）"
echo ""
npx wrangler login

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 登录失败，请重试！"
    exit 1
fi

echo ""
echo "🚀 Step 3: 部署 Worker..."
echo ""
npx wrangler deploy

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 部署失败，请检查错误信息！"
    exit 1
fi

echo ""
echo "✅ ✅ 部署成功！"
echo ""
echo "请把上面显示的 Worker URL（类似 https://boke-api.xxxxxxxx.workers.dev）"
echo "发给帮您部署的工程师！"
echo ""
echo "然后继续在 Cloudflare Dashboard 中创建数据库表！"
echo ""
