# 📊 数据库表创建指南

## 方法 1：在 Cloudflare Dashboard 中创建（最简单！）

### 步骤 1：登录 Cloudflare

1. 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 登录你的账户

### 步骤 2：进入 D1 数据库

1. 在左侧菜单找到 **Workers & Pages**
2. 点击左侧 **D1**
3. 找到并点击 **blog_db** 数据库

### 步骤 3：执行 SQL 创建表

1. 在 D1 数据库页面，点击左侧的 **Console** 标签
2. 将下面的 SQL 复制粘贴到输入框中：

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  images TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
```

3. 点击 **Run** 按钮执行

### 步骤 4：验证表创建

1. 点击左侧的 **Tables** 标签
2. 你应该能看到 `posts` 表已创建
3. 点击 `posts` 可以查看表结构

---

## 方法 2：在本地运行 Wrangler（需要先登录）

### 步骤 1：登录 Cloudflare

在终端中运行：

```bash
npx wrangler login
```

这会打开浏览器，让你登录 Cloudflare 账户。

### 步骤 2：执行迁移

登录成功后，运行：

```bash
npx wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql --remote
```

当提示确认时，输入 `Y` 并回车。

### 步骤 3：验证

```bash
# 查看表
npx wrangler d1 execute blog_db --command="SELECT name FROM sqlite_master WHERE type='table'" --remote

# 查看 posts 表结构
npx wrangler d1 execute blog_db --command="PRAGMA table_info(posts)" --remote
```

---

## 方法 3：在部署后使用 Cloudflare Dashboard

### 如果已经部署了 Pages：

1. 前往 Cloudflare Dashboard
2. 进入 **Workers & Pages** → 你的 Pages 项目
3. 点击 **Settings** → **Functions**
4. 找到 **D1 database** 绑定，点击链接进入数据库
5. 按照方法 1 中的步骤执行 SQL

---

## ✅ 验证表创建成功

无论使用哪种方法，执行以下 SQL 来验证：

```sql
-- 查看所有表
SELECT name FROM sqlite_master WHERE type='table';

-- 查看 posts 表结构
PRAGMA table_info(posts);

-- 查看 posts 表中的数据（应该是空的）
SELECT * FROM posts;
```

### 预期结果：

1. 能看到 `posts` 表
2. 表结构包含以下列：
   - id (INTEGER, PRIMARY KEY)
   - title (TEXT)
   - content (TEXT)
   - images (TEXT)
   - tags (TEXT)
   - likes (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

---

## 📝 添加测试数据（可选）

表创建成功后，可以添加测试文章：

```sql
INSERT INTO posts (title, content, images, tags) 
VALUES (
  '欢迎来到我的博客', 
  '这是我的第一篇文章！',
  '[]',
  '["欢迎", "博客"]'
);
```

验证：

```sql
SELECT * FROM posts;
```

---

## 🎯 表结构说明

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| title | TEXT | 文章标题 |
| content | TEXT | 文章内容 |
| images | TEXT | JSON 格式存储的图片数组 |
| tags | TEXT | JSON 格式存储的标签数组 |
| likes | INTEGER | 点赞数，默认 0 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

---

## 🔗 相关文件

- [migrations/0001_create_posts_table.sql](file:///Users/liuliusiyi/Desktop/liusisi/migrations/0001_create_posts_table.sql) - 迁移文件
- [wrangler.toml](file:///Users/liuliusiyi/Desktop/liusisi/wrangler.toml) - 配置文件

---

## 💡 提示

- 推荐使用 **方法 1**（Cloudflare Dashboard），最简单直观
- 如果遇到问题，可以查看 [DEPLOYMENT_GUIDE.md](file:///Users/liuliusiyi/Desktop/liusisi/DEPLOYMENT_GUIDE.md)
