# Dreamy Moments - 图文与音乐管理系统

一个基于 Cloudflare Pages + D1 数据库的优雅图文发布与音乐管理系统，具有淡紫色梦幻风格。

## ✨ 功能特性

### 📝 内容发布
- **三种模式**：纯文字、纯图片、图文混合
- **智能排版**：
  - 纯文字：艺术衬线体，居中诗歌风
  - 1张图：宽幅展示
  - 2-4张图：非对称拼贴布局
  - 5+张图：瀑布流布局
- **图片上传**：支持点击选择或拖拽上传，Base64编码存储

### 🎵 音乐管理
- 添加音乐曲目
- 支持音频URL播放
- 管理曲目列表

### 🎨 视觉设计
- **梦幻背景**：淡紫色渐变，径向光晕
- **浮动装饰**：蝴蝶与牡丹
- **毛玻璃卡片**：半透明模糊效果
- **核心文案**："When the world is meaningless, I will wear headphones with your voice."
- **社交链接**：Instagram + 小红书

### 🎬 交互效果
- 入场动画：从下往上 20px 柔滑滑入
- 缓动曲线：cubic-bezier(0.2, 0.8, 0.2, 1)
- 悬停反馈：卡片上浮 + 图片缩放
- 平滑过渡：所有动画持续 0.6s

## 📁 项目结构

```
dreamy-music-blog/
├── index.html                          # 主页面
├── package.json                        # 项目依赖
├── wrangler.toml                       # Cloudflare 配置
├── migrations/
│   └── schema.sql                      # 数据库结构
├── functions/
│   └── api/
│       ├── posts/
│       │   └── index.js                # 文章 API
│       └── music/
│           └── index.js                # 音乐 API
└── docs/
    ├── DEPLOYMENT_CHECKLIST.md
    ├── DATABASE_SETUP.md
    └── PROJECT_SUMMARY.md
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置数据库
在 Cloudflare Dashboard 中创建 D1 数据库，然后执行：
```bash
# 使用 wrangler 执行 schema
npm run init-db
```

或者在 Dashboard Console 中运行 [migrations/schema.sql](file:///Users/liuliusiyi/Desktop/liusisi/migrations/schema.sql) 的内容。

### 3. 本地开发
```bash
npm run dev
```

访问 http://localhost:8788

### 4. 部署到 Cloudflare
```bash
npm run deploy
```

## 📊 数据库结构

### posts 表
| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| content | TEXT | 文章内容 |
| images | TEXT | Base64图片JSON数组 |
| type | TEXT | 内容类型(text/image/mixed) |
| created_at | TIMESTAMP | 创建时间 |

### music_tracks 表
| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| title | TEXT | 歌曲名称 |
| artist | TEXT | 艺术家 |
| audio_url | TEXT | 音频链接 |
| created_at | TIMESTAMP | 创建时间 |

## 🎯 API 端点

### 文章 API `/api/posts`
- `GET` - 获取所有文章
- `POST` - 创建新文章
  ```json
  {
    "content": "内容",
    "images": ["base64数据"],
    "type": "text"
  }
  ```
- `DELETE` - 删除文章 (`?id=123`)

### 音乐 API `/api/music`
- `GET` - 获取所有曲目
- `POST` - 添加新曲目
  ```json
  {
    "title": "歌曲名",
    "artist": "艺术家",
    "audio_url": "音频链接"
  }
  ```
- `DELETE` - 删除曲目 (`?id=123`)

## 📝 使用说明

### 发布内容
1. 点击顶部导航的 "Publish" 标签
2. 选择发布类型（纯文字/纯图片/图文混合）
3. 输入内容或上传图片
4. 点击 "Publish" 发布

### 管理音乐
1. 点击 "Music" 标签
2. 填写歌曲信息
3. 点击 "Add Music" 添加

### 视觉预览
- 纯文字内容会自动居中，使用艺术字体
- 多张图片会智能排列
- 所有卡片有毛玻璃效果和缓动动画

## 🔧 配置文件

### wrangler.toml
```toml
name = "dreamy-music-blog"
compatibility_date = "2024-04-03"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./"

[[d1_databases]]
binding = "DB"
database_name = "blog_db"
database_id = "7f5ce7b6-0ffa-467e-9ff6-87afafff0ead"
```

### package.json
```json
{
  "name": "dreamy-music-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "wrangler pages dev .",
    "deploy": "wrangler pages deploy .",
    "init-db": "wrangler d1 execute blog_db --file=./migrations/schema.sql --remote"
  },
  "dependencies": {
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "wrangler": "^3.114.17"
  }
}
```

## 🎨 设计细节

### 配色方案
- 主背景：淡紫色渐变 `#f5f0ff` → `#e6e6ff`
- 文字色：淡紫灰 `#5a4a6e`
- 强调色：紫色系 `#7a5a8a`, `#9a7aaa`
- 卡片背景：半透明白 `rgba(255,255,255,0.3)`

### 排版
- 衬线字体：Playfair Display（英文）
- 中文字体：Noto Serif SC
- 纯文字排版：大号斜体，居中对齐，行高 2

### 动画
- 入场：slideIn（0.6s 持续时间）
- 悬停：scale(1.02)，毛玻璃模糊加深
- 浮动：蝴蝶和牡丹的缓慢 float 动画

## 📋 部署清单

详细步骤请查看 [DEPLOYMENT_CHECKLIST.md](file:///Users/liuliusiyi/Desktop/liusisi/DEPLOYMENT_CHECKLIST.md)

1. ✅ 安装依赖：`npm install`
2. ✅ 初始化数据库：运行 schema
3. ✅ 配置 wrangler.toml
4. ✅ 部署到 Cloudflare Pages
5. ✅ 在 Dashboard 中绑定 D1 数据库
6. ✅ 测试 API 和页面

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + 原生 JavaScript
- **后端**：Cloudflare Pages Functions
- **数据库**：Cloudflare D1 (SQLite)
- **部署**：Cloudflare Pages
- **字体**：Google Fonts (Playfair Display, Noto Serif SC)
- **图标**：内置 SVG + emoji

## 📞 联系方式

- Instagram：[u_u4141](https://www.instagram.com/u_u4141)
- 小红书：63510854366

---

✨ **Dreamy Moments** - When the world is meaningless, I will wear headphones with your voice.
