# Cloudflare Pages + D1 部署指南

## 配置文件说明

### 1. wrangler.toml 配置

```toml
name = "yy8-blog"
compatibility_date = "2024-04-03"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./"

[[d1_databases]]
binding = "DB"
database_name = "blog_db"
database_id = "7f5ce7b6-0ffa-467e-9ff6-87afafff0ead"
```

**配置说明：**
- `binding = "DB"` - 与代码中 `env.DB` 对应
- `database_name = "blog_db"` - 数据库显示名称
- `database_id` - 你的 D1 数据库 ID

## 部署步骤

### 步骤 1：创建 D1 数据库（如果还没有）

```bash
wrangler d1 create blog_db
```

这会返回 database_id，复制到 wrangler.toml 中。

### 步骤 2：初始化数据库表

```bash
wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql
```

### 步骤 3：本地测试（可选）

```bash
wrangler pages dev .
```

访问 `http://localhost:8788/api/index` 测试 API。

### 步骤 4：部署到 Cloudflare Pages

**方法 1：使用 Wrangler CLI**

```bash
npm run deploy
```

或者直接：

```bash
wrangler pages deploy . --project-name=yy8-blog
```

**方法 2：使用 Git 部署**

1. 将代码推送到 GitHub/GitLab 仓库
2. 在 Cloudflare Dashboard 中：
   - 前往 Pages
   - 点击 "Create a project"
   - 选择你的 Git 仓库
   - 配置构建命令：`npm run deploy`
   - **重要：在 Settings > Environment variables 中添加 D1 数据库绑定**

### 步骤 5：在 Cloudflare Dashboard 中绑定 D1 数据库

**如果使用 Git 部署：**

1. 前往 Pages 项目设置
2. 点击 "Settings" > "Functions"
3. 在 "D1 Databases" 部分点击 "Bind D1 Database"
4. 选择你的 `blog_db` 数据库
5. 变量名填写：`DB`
6. 点击 "Save"

## 验证部署

### 测试 GET 请求

```bash
curl https://your-project.pages.dev/api/index
```

预期返回：

```json
[
  {
    "id": 1,
    "title": "文章标题",
    "content": "文章内容",
    "images": "[]",
    "tags": "[]",
    "likes": 0,
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
]
```

### 测试 POST 请求

```bash
curl -X POST https://your-project.pages.dev/api/index \
  -H "Content-Type: application/json" \
  -d '{"title": "测试文章", "content": "这是测试内容"}'
```

预期返回：

```json
{
  "success": true,
  "id": 2
}
```

## API 端点说明

- **GET /api/index** - 获取所有文章（按时间倒序）
- **POST /api/index** - 发布新文章
  - 请求体：`{ "title": "标题", "content": "内容", "images": [], "tags": [] }`
- **GET /api/posts/{id}** - 获取单篇文章
- **PUT /api/posts/{id}** - 更新文章
- **DELETE /api/posts/{id}** - 删除文章
- **POST /api/posts/like** - 点赞文章

## 常见问题排查

### 错误 1: "Cannot find D1 database binding"

**原因：** wrangler.toml 中 D1 配置缺失或格式错误

**解决：**
1. 检查 wrangler.toml 是否有 `[[d1_databases]]` 配置块
2. 确认 `binding = "DB"` 与代码中 `env.DB` 一致
3. 如果使用 Git 部署，确保在 Dashboard 中手动绑定了 D1 数据库

### 错误 2: "Database not found"

**原因：** D1 数据库 ID 不正确或数据库未创建

**解决：**
```bash
wrangler d1 list
```

确认数据库存在且 ID 正确。

### 错误 3: "Table 'posts' doesn't exist"

**原因：** 数据库表未初始化

**解决：**
```bash
wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql
```

### 错误 4: "Module not found"

**原因：** Functions 文件路径错误

**解决：**
- Cloudflare Pages Functions 应该在 `functions/` 目录
- 文件结构应为：`functions/api/index.js`
- 访问路径：`/api/index`

## 数据库迁移

如果需要修改数据库结构：

1. 创建新的迁移文件：`migrations/0002_xxx.sql`
2. 运行迁移：
```bash
wrangler d1 execute blog_db --file=./migrations/0002_xxx.sql
```

## 性能优化建议

1. **添加索引**：在 `migrations/0001_create_posts_table.sql` 中已添加 `idx_posts_created_at` 索引
2. **限制查询**：对大数据集添加 LIMIT
3. **使用 CDN**：确保静态资源启用 Cloudflare CDN
4. **配置缓存**：在 API 响应中添加适当的缓存头

## 本地开发调试

```bash
# 安装依赖
npm install

# 本地开发
wrangler pages dev .

# 测试 API
curl http://localhost:8788/api/index
```

## 环境变量（可选）

如果需要环境变量，在 wrangler.toml 中添加：

```toml
[vars]
ENVIRONMENT = "production"
```

在代码中访问：
```javascript
const environment = env.ENVIRONMENT;
```

## 监控和日志

1. 在 Cloudflare Dashboard 查看 Functions 日志
2. 使用 `wrangler tail` 查看实时日志：
```bash
wrangler pages project list
wrangler pages deployment tail yy8-blog
```

## 安全建议

1. **不要提交 secrets**：将敏感信息添加到环境变量
2. **启用 CORS**：已为 API 添加 CORS 头
3. **验证输入**：所有用户输入都应该验证
4. **限制写入**：考虑添加认证机制保护 POST/PUT/DELETE 端点
