# 🚀 部署清单 - 按顺序执行

## ✅ 已完成（无需操作）

1. ✅ **wrangler.toml** - 已优化配置
2. ✅ **functions/api/index.js** - 已创建 GET/POST API
3. ✅ **DEPLOYMENT_GUIDE.md** - 详细部署指南
4. ✅ **PROJECT_SUMMARY.md** - 项目配置总结
5. ✅ **deploy.sh** - 交互式部署脚本
6. ✅ **quick-commands.sh** - 快速命令参考

---

## 📋 开始部署 - 按顺序执行

### 第一步：安装依赖

```bash
npm install
```

### 第二步：初始化数据库（重要！）

⚠️ **如果这是首次部署或新的 D1 数据库，必须执行此步骤**

```bash
# 使用 Wrangler CLI
wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql --remote
```

### 第三步：部署

#### 选项 A：使用交互式脚本（推荐）

```bash
chmod +x deploy.sh
./deploy.sh
```

#### 选项 B：使用快速命令

```bash
chmod +x quick-commands.sh
bash quick-commands.sh deploy
```

#### 选项 C：直接部署

```bash
npm run deploy
```

### 第四步：验证部署

部署成功后，运行测试：

```bash
# 测试 GET 请求
curl https://yy8-blog.pages.dev/api/index

# 测试 POST 请求
curl -X POST https://yy8-blog.pages.dev/api/index \
  -H "Content-Type: application/json" \
  -d '{"title":"测试文章","content":"这是测试内容"}'
```

---

## ⚠️ Git 部署特殊说明

如果你使用 Git 部署到 Cloudflare Pages：

### 1. 推送到 GitHub

```bash
git add .
git commit -m "Update Cloudflare Pages + D1 configuration"
git push origin main
```

### 2. 在 Cloudflare Dashboard 配置

#### 2.1 绑定 D1 数据库（关键步骤！）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 前往 **Pages**
3. 选择你的项目（yy8-blog）
4. 点击 **Settings**
5. 选择 **Functions**
6. 找到 **D1 Databases** 部分
7. 点击 **Bind D1 Database**
8. 配置：
   - **Variable name**: `DB`
   - **Value**: `blog_db`
9. 点击 **Save**

#### 2.2 触发重新部署

1. 推送新的提交到 Git
2. Cloudflare 会自动检测并部署
3. 或手动点击 **Retry deployment**

### 3. 验证 Git 部署

```bash
# 查看部署状态
wrangler pages deployment list yy8-blog

# 查看日志
wrangler pages deployment tail yy8-blog
```

---

## 🔍 故障排查

### 问题：wrangler 命令找不到

```bash
# 安装 Wrangler
npm install -g wrangler

# 验证安装
wrangler --version
```

### 问题：Database binding not found

**原因**：Git 部署时未在 Dashboard 中绑定 D1

**解决**：
1. 前往 Pages 项目 Settings
2. 点击 Functions
3. 绑定 D1 数据库（见上面的详细说明）
4. 重新部署

### 问题：Table 'posts' doesn't exist

**原因**：数据库表未创建

**解决**：
```bash
wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql --remote
```

### 问题：Deployment failed

**检查项**：
1. ✅ wrangler.toml 格式正确
2. ✅ functions 目录结构正确
3. ✅ D1 数据库存在
4. ✅ 有部署权限

```bash
# 查看详细错误
wrangler pages deploy . --verbose
```

---

## 🎯 成功标准

部署成功后，你应该看到：

### 1. CLI 输出

```
✅ Successfully deployed...
✨ Deployment complete!
```

### 2. API 测试成功

```bash
# GET 请求
curl https://yy8-blog.pages.dev/api/index

# 响应示例
[]
```

```bash
# POST 请求
curl -X POST https://yy8-blog.pages.dev/api/index \
  -H "Content-Type: application/json" \
  -d '{"title":"测试","content":"内容"}'

# 响应示例
{"success":true,"id":1}
```

### 3. 前端页面正常

访问 `https://yy8-blog.pages.dev/`

应该能看到博客首页，并且能从 D1 读取文章列表。

---

## 📊 监控和维护

### 查看部署历史

```bash
wrangler pages deployment list yy8-blog
```

### 查看实时日志

```bash
wrangler pages deployment tail yy8-blog
```

### 回滚到之前版本

```bash
wrangler pages deployment rollback yy8-blog
```

### 管理数据库

```bash
# 查看数据库信息
wrangler d1 list

# 查看数据库表
wrangler d1 execute blog_db --command="SELECT * FROM posts" --remote

# 备份数据库
wrangler d1 export blog_db --remote > backup.sql
```

---

## 🆘 获取帮助

如果遇到问题：

1. **查看详细日志**：
   ```bash
   wrangler pages deployment tail yy8-blog
   ```

2. **阅读部署指南**：
   ```bash
   cat DEPLOYMENT_GUIDE.md
   ```

3. **查看项目总结**：
   ```bash
   cat PROJECT_SUMMARY.md
   ```

4. **使用帮助脚本**：
   ```bash
   bash quick-commands.sh
   ```

---

## 📝 快速命令备忘

```bash
# 安装
npm install

# 本地开发
wrangler pages dev .

# 初始化数据库
wrangler d1 execute blog_db --file=./migrations/0001_create_posts_table.sql --remote

# 部署
npm run deploy

# 测试 API
curl https://yy8-blog.pages.dev/api/index

# 查看日志
wrangler pages deployment tail yy8-blog

# 查看部署
wrangler pages deployment list yy8-blog
```

---

**状态**：✅ 准备就绪，可以开始部署！

**下一步**：执行上面的"开始部署"步骤
