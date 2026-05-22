# 启动说明

## 1. 安装依赖
```bash
cd server
npm install
```

## 2. 启动服务器
```bash
npm start
```

服务器将在 http://localhost:3000 运行

## 3. 数据库
- 数据库文件: `blog.db` (SQLite)
- 自动创建，无需手动配置

## 4. 功能
- ✅ 完整的 REST API
- ✅ 支持照片存储
- ✅ 支持音乐存储
- ✅ 支持录音存储
- ✅ 数据备份/恢复
- ✅ 无容量限制

## 5. API 端点

### Posts (发布)
- GET    /api/posts      - 获取所有发布
- POST   /api/posts      - 创建发布
- PUT    /api/posts/:id - 更新发布
- DELETE /api/posts/:id - 删除发布

### Music (音乐)
- GET    /api/music      - 获取所有音乐
- POST   /api/music      - 添加音乐
- DELETE /api/music/:id  - 删除音乐

### Photography (摄影)
- GET    /api/photography    - 获取所有照片
- POST   /api/photography    - 上传照片
- DELETE /api/photography/:id - 删除照片

### Comments (留言)
- GET    /api/comments     - 获取所有留言
- POST   /api/comments     - 添加留言
- DELETE /api/comments/:id - 删除留言

### Voice (录音)
- GET    /api/voice      - 获取所有录音
- POST   /api/voice      - 添加录音
- DELETE /api/voice/:id  - 删除录音

### Backup (备份)
- GET    /api/backup     - 导出所有数据
- POST   /api/backup     - 导入数据
