-- ======================================
-- Cloudflare D1 数据库初始化
-- ======================================

-- 1. 创建 posts 表（文章发布）
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

-- 2. 创建 music 表（音乐管理）
CREATE TABLE IF NOT EXISTS music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    description TEXT,
    cover TEXT,
    audio_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建 photography 表（摄影）
CREATE TABLE IF NOT EXISTS photography (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    location TEXT,
    time TEXT,
    description TEXT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建 comments 表（评论）
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    content TEXT,
    time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. 创建 voice_recordings 表（录音）
CREATE TABLE IF NOT EXISTS voice_recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    audio_data TEXT,
    duration INTEGER,
    time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- 完成！
-- ======================================
