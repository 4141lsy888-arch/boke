/**
 * Cloudflare Pages 静态构建脚本
 * 真实站点是根目录下自包含的 index.html，
 * 构建时将其组装到 out/ 目录供 Pages 发布，
 * 避免 Cloudflare 把仓库误识别为 Next.js 项目而执行 next build。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

fs.copyFileSync(path.join(root, 'index.html'), path.join(out, 'index.html'));

console.log('✓ 静态站点已组装到 out/index.html');
