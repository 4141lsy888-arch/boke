# 🔍 数据库检查指南

## 方法 1：在 Cloudflare Dashboard 中检查（最简单）

### 步骤 1：登录 Cloudflare

1. 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 登录你的账户

### 步骤 2：进入 D1 数据库

1. 在左侧菜单找到 **Workers & Pages**
2. 点击左侧 **D1**
3. 找到并点击 **blog_db** 数据库

### 步骤 3：检查表结构

1. 点击 **Tables** 标签
2. 你应该能看到 **posts** 表

### 步骤 4：验证表结构

点击 **posts** 表，确认包含以下列：
- ✅ id (INTEGER, PRIMARY KEY)
- ✅ title (TEXT)
- ✅ content (TEXT)
- ✅ images (TEXT)
- ✅ tags (TEXT)
- ✅ likes (INTEGER)
- ✅ created_at (TIMESTAMP)
- ✅ updated_at (TIMESTAMP)

### 步骤 5：查看数据

1. 点击 **Console** 标签
2. 运行以下 SQL：

```sql
SELECT * FROM posts;
```

如果表已创建但没有数据，应该显示空结果集。

---

## 方法 2：创建 API Token（可选）

如果你想在本地使用 Wrangler CLI：

### 步骤 1：创建 API Token

1. 访问 [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 配置：
   - **Account Resources**: 你的账户
   - **Zone Resources**: 所有区域
5. 点击 **Create Token**
6. 复制生成的 token

### 步骤 2：设置环境变量

在终端中运行：

```bash
export CLOUDFLARE_API_TOKEN="your-api-token-here"
```

或者永久设置（在 `~/.zshrc` 或 `~/.bashrc` 中添加）：

```bash
echo 'export CLOUDFLARE_API_TOKEN="your-api-token-here"' >> ~/.zshrc
source ~/.zshrc
```

### 步骤 3：验证数据库

```bash
# 列出所有表
npx wrangler d1 execute blog_db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote

# 查看 posts 表结构
npx wrangler d1 execute blog_db --command="PRAGMA table_info(posts);" --remote

# 查看 posts 表数据
npx wrangler d1 execute blog_db --command="SELECT * FROM posts;" --remote
```

---

## 方法 3：测试 API 端点

部署后，可以通过 HTTP 请求测试数据库连接：

### 测试 GET 请求

```bash
curl https://yy8-blog.pages.dev/api/index
```

**预期结果：**
- 如果数据库和表都正常：返回空数组 `[]` 或文章列表
- 如果有问题：返回错误信息

### 测试 POST 请求

```bash
curl -X POST https://yy8-blog.pages.dev/api/index \
  -H "Content-Type: application/json" \
  -d '{"title":"测试","content":"数据库连接测试"}'
```

**预期结果：**
```json
{"success": true, "id": 1}
```

---

## ✅ 成功标准

### 1. Cloudflare Dashboard 检查

- ✅ D1 数据库 `blog_db` 存在
- ✅ `posts` 表已创建
- ✅ 表结构正确
- ✅ 可以执行查询

### 2. API 测试

- ✅ GET `/api/index` 返回 200 状态码
- ✅ POST `/api/index` 可以创建文章
- ✅ 返回正确的 JSON 响应

---

## 🔧 常见问题排查

### 问题 1：找不到 blog_db 数据库

**原因**：数据库未创建

**解决**：创建新的 D1 数据库
```bash
npx wrangler d1 create blog_db
```

### 问题 2：posts 表不存在

**原因**：表未创建

**解决**：在 Dashboard Console 中执行建表 SQL

### 问题 3：API 返回数据库绑定错误

**原因**：Git 部署时未在 Dashboard 中绑定 D1

**解决**：
1. 进入 Pages 项目设置
2. Settings → Functions
3. 绑定 D1 数据库（Variable name: `DB`）

### 问题 4：Wrangler 提示需要 API Token

**原因**：未配置认证

**解决**：
1. 使用 Dashboard 检查（推荐）
2. 或创建 API Token（见方法 2）

---

## 📝 快速检查清单

在 Cloudflare Dashboard 中逐项检查：

- [ ] 登录 Cloudflare Dashboard
- [ ] 进入 D1 页面
- [ ] 找到 blog_db 数据库
- [ ] 查看 Tables 标签
- [ ] 确认 posts 表存在
- [ ] 点击 posts 查看结构
- [ ] 进入 Console 执行测试查询
- [ ] 记录检查结果

---

## 💡 推荐做法

1. **优先使用 Dashboard** - 最简单直观
2. **定期检查** - 确保数据库正常运行
3. **测试 API** - 验证数据读写功能
4. **查看日志** - 在 Pages 项目中查看 Functions 日志

---

## 🔗 快速链接

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [D1 文档](https://developers.cloudflare.com/d1/)
- [API Token 设置](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
