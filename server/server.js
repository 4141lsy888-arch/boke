const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database('blog.db');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database
function initDatabase() {
  // Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      location TEXT,
      tags TEXT,
      images TEXT,
      time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Music table
  db.exec(`
    CREATE TABLE IF NOT EXISTS music (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT,
      description TEXT,
      cover TEXT,
      audioUrl TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Photography table
  db.exec(`
    CREATE TABLE IF NOT EXISTS photography (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      location TEXT,
      time TEXT,
      description TEXT,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Comments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      content TEXT,
      time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Voice recordings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS voice_recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      audioData TEXT,
      duration INTEGER,
      time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database initialized successfully');
}

// ==================== POSTS API ====================

// Get all posts
app.get('/api/posts', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create new post
app.post('/api/posts', (req, res) => {
  try {
    const { title, content, location, tags, images } = req.body;
    const stmt = db.prepare(`
      INSERT INTO posts (title, content, location, tags, images, time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      title,
      content,
      location,
      JSON.stringify(tags || []),
      JSON.stringify(images || []),
      new Date().toLocaleString('zh-CN')
    );
    
    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    res.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.put('/api/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, location, tags, images } = req.body;
    
    const stmt = db.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, location = ?, tags = ?, images = ?, time = ?
      WHERE id = ?
    `);
    stmt.run(
      title,
      content,
      location,
      JSON.stringify(tags || []),
      JSON.stringify(images || []),
      new Date().toLocaleString('zh-CN'),
      id
    );
    
    const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Like post
app.post('/api/posts/like', (req, res) => {
  try {
    const { id } = req.body;
    res.json({ success: true, likes: Math.floor(Math.random() * 100) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// ==================== MUSIC API ====================

// Get all music
app.get('/api/music', (req, res) => {
  try {
    const music = db.prepare('SELECT * FROM music ORDER BY created_at DESC').all();
    res.json(music);
  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({ error: 'Failed to fetch music' });
  }
});

// Create music
app.post('/api/music', (req, res) => {
  try {
    const { title, artist, description, cover, audioUrl } = req.body;
    const stmt = db.prepare(`
      INSERT INTO music (title, artist, description, cover, audioUrl)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, artist, description, cover, audioUrl);
    
    const newMusic = db.prepare('SELECT * FROM music WHERE id = ?').get(result.lastInsertRowid);
    res.json(newMusic);
  } catch (error) {
    console.error('Error creating music:', error);
    res.status(500).json({ error: 'Failed to create music' });
  }
});

// Delete music
app.delete('/api/music/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM music WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete music' });
  }
});

// ==================== PHOTOGRAPHY API ====================

// Get all photos
app.get('/api/photography', (req, res) => {
  try {
    const photos = db.prepare('SELECT * FROM photography ORDER BY created_at DESC').all();
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Create photo
app.post('/api/photography', (req, res) => {
  try {
    const { title, location, time, description, data } = req.body;
    const stmt = db.prepare(`
      INSERT INTO photography (title, location, time, description, data)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, location, time, description, data);
    
    const newPhoto = db.prepare('SELECT * FROM photography WHERE id = ?').get(result.lastInsertRowid);
    res.json(newPhoto);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

// Delete photo
app.delete('/api/photography/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM photography WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// ==================== COMMENTS API ====================

// Get all comments
app.get('/api/comments', (req, res) => {
  try {
    const comments = db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
app.post('/api/comments', (req, res) => {
  try {
    const { nickname, content } = req.body;
    const stmt = db.prepare(`
      INSERT INTO comments (nickname, content, time)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(nickname, content, new Date().toLocaleString('zh-CN'));
    
    const newComment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Delete comment
app.delete('/api/comments/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ==================== VOICE RECORDINGS API ====================

// Get all voice recordings
app.get('/api/voice', (req, res) => {
  try {
    const recordings = db.prepare('SELECT * FROM voice_recordings ORDER BY created_at DESC').all();
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voice recordings' });
  }
});

// Create voice recording
app.post('/api/voice', (req, res) => {
  try {
    const { title, description, audioData, duration } = req.body;
    const stmt = db.prepare(`
      INSERT INTO voice_recordings (title, description, audioData, duration, time)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, audioData, duration, new Date().toLocaleString('zh-CN'));
    
    const newRecording = db.prepare('SELECT * FROM voice_recordings WHERE id = ?').get(result.lastInsertRowid);
    res.json(newRecording);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create voice recording' });
  }
});

// Delete voice recording
app.delete('/api/voice/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM voice_recordings WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete voice recording' });
  }
});

// ==================== BACKUP API ====================

// Export all data
app.get('/api/backup', (req, res) => {
  try {
    const backup = {
      posts: db.prepare('SELECT * FROM posts').all(),
      music: db.prepare('SELECT * FROM music').all(),
      photography: db.prepare('SELECT * FROM photography').all(),
      comments: db.prepare('SELECT * FROM comments').all(),
      voice_recordings: db.prepare('SELECT * FROM voice_recordings').all(),
      exported_at: new Date().toISOString()
    };
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Import data
app.post('/api/backup', (req, res) => {
  try {
    const { posts, music, photography, comments, voice_recordings } = req.body;

    // Clear existing data
    db.exec('DELETE FROM posts');
    db.exec('DELETE FROM music');
    db.exec('DELETE FROM photography');
    db.exec('DELETE FROM comments');
    db.exec('DELETE FROM voice_recordings');

    // Import posts
    if (posts && posts.length > 0) {
      const insertPost = db.prepare(`
        INSERT INTO posts (title, content, location, tags, images, time, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      posts.forEach(post => {
        insertPost.run(post.title, post.content, post.location, 
          JSON.stringify(post.tags || []), 
          JSON.stringify(post.images || []), 
          post.time, post.created_at);
      });
    }

    // Import music
    if (music && music.length > 0) {
      const insertMusic = db.prepare(`
        INSERT INTO music (title, artist, description, cover, audioUrl, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      music.forEach(m => {
        insertMusic.run(m.title, m.artist, m.description, m.cover, m.audioUrl, m.created_at);
      });
    }

    // Import photography
    if (photography && photography.length > 0) {
      const insertPhoto = db.prepare(`
        INSERT INTO photography (title, location, time, description, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      photography.forEach(p => {
        insertPhoto.run(p.title, p.location, p.time, p.description, p.data, p.created_at);
      });
    }

    // Import comments
    if (comments && comments.length > 0) {
      const insertComment = db.prepare(`
        INSERT INTO comments (nickname, content, time, created_at)
        VALUES (?, ?, ?, ?)
      `);
      comments.forEach(c => {
        insertComment.run(c.nickname, c.content, c.time, c.created_at);
      });
    }

    // Import voice recordings
    if (voice_recordings && voice_recordings.length > 0) {
      const insertVoice = db.prepare(`
        INSERT INTO voice_recordings (title, description, audioData, duration, time, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      voice_recordings.forEach(v => {
        insertVoice.run(v.title, v.description, v.audioData, v.duration, v.time, v.created_at);
      });
    }

    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: 'connected',
    tables: ['posts', 'music', 'photography', 'comments', 'voice_recordings']
  });
});

// Start server
initDatabase();

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Database: blog.db`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET    /api/posts`);
  console.log(`   POST   /api/posts`);
  console.log(`   PUT    /api/posts/:id`);
  console.log(`   DELETE /api/posts/:id`);
  console.log(`   GET    /api/music`);
  console.log(`   POST   /api/music`);
  console.log(`   GET    /api/photography`);
  console.log(`   POST   /api/photography`);
  console.log(`   GET    /api/comments`);
  console.log(`   POST   /api/comments`);
  console.log(`   GET    /api/voice`);
  console.log(`   POST   /api/voice`);
  console.log(`   GET    /api/backup`);
  console.log(`   POST   /api/backup`);
  console.log(`   GET    /api/health`);
  console.log('\n');
});
