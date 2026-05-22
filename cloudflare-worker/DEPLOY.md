# Cloudflare Worker API 部署指南

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 部署 Worker

```bash
cd cloudflare-worker
wrangler deploy
```

部署成功后会返回 Worker URL，例如：
```
https://boke-api.your-account.workers.dev
```

### 4. 在 D1 数据库中创建表

在 Cloudflare Dashboard 中：
1. 进入 **Workers & Pages** → **D1** → 您的数据库
2. 点击 **Query** 标签
3. 运行以下 SQL：

```sql
-- Posts 表
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  location TEXT,
  tags TEXT DEFAULT '[]',
  images TEXT DEFAULT '[]',
  time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Music 表
CREATE TABLE IF NOT EXISTS music (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT,
  description TEXT,
  cover TEXT,
  audio_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Photography 表
CREATE TABLE IF NOT EXISTS photography (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  location TEXT,
  time TEXT,
  description TEXT,
  data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments 表
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL,
  content TEXT,
  time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Voice recordings 表
CREATE TABLE IF NOT EXISTS voice_recordings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  audio_data TEXT,
  duration INTEGER,
  time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API 地址

部署后，您的 API 地址将是：
```
https://boke-api.your-account.workers.dev
```

## 测试 API

```bash
# 测试健康检查
curl https://boke-api.your-account.workers.dev/api/health

# 获取所有发布
curl https://boke-api.your-account.workers.dev/api/posts

# 创建发布
curl -X POST https://boke-api.your-account.workers.dev/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"测试","content":"内容","location":"北京"}'
```

## 常见问题

### 1. 部署失败
- 确保已登录：`wrangler login`
- 确保 Wrangler 版本最新：`npm update -g wrangler`

### 2. 数据库连接失败
- 检查 wrangler.toml 中的 database_id 是否正确
- 确保 D1 数据库已创建

### 3. CORS 错误
- Worker 已配置 CORS 头，允许所有来源访问
- 如果需要限制来源，修改 index.js 中的 corsHeaders
