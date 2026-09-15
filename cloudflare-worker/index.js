/**
 * Cloudflare Worker - D1 Database API
 * 用于 yy8's blog
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 管理员鉴权：写操作必须携带 X-Admin-Token（值为管理密码，经服务端校验）
    const isAdmin = () => request.headers.get('X-Admin-Token') === env.ADMIN_PASSWORD;
    const unauthorized = () => new Response(JSON.stringify({ error: '未授权：请先登录管理后台' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ==================== 登录验证 ====================
      if (path === '/api/verify' && request.method === 'POST') {
        const body = await request.json();
        const ok = body.password === env.ADMIN_PASSWORD;
        return new Response(JSON.stringify({ success: ok }), {
          status: ok ? 200 : 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== POSTS API ====================
      if (path === '/api/posts' && request.method === 'GET') {
        const posts = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(posts.results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/posts' && request.method === 'POST') {
        if (!isAdmin()) return unauthorized();
        const body = await request.json();
        const { title, content, images, tags } = body;

        const result = await env.DB.prepare('INSERT INTO posts (id, title, content, author, images, tags) VALUES (NULL, ?, ?, ?, ?, ?)').bind(
          title,
          content,
          body.author || 'yy8',
          JSON.stringify(images || []),
          JSON.stringify(tags || [])
        ).run();
        
        const newPost = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newPost), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/posts\/\d+$/) && request.method === 'PUT') {
        if (!isAdmin()) return unauthorized();
        const id = path.split('/')[3];
        const body = await request.json();
        const { title, content, images, tags } = body;

        await env.DB.prepare('UPDATE posts SET title = ?, content = ?, images = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(
          title,
          content,
          JSON.stringify(images || []),
          JSON.stringify(tags || []),
          id
        ).run();
        
        const updatedPost = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
        return new Response(JSON.stringify(updatedPost), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/posts\/\d+$/) && request.method === 'DELETE') {
        if (!isAdmin()) return unauthorized();
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/posts/like' && request.method === 'POST') {
        return new Response(JSON.stringify({ success: true, likes: Math.floor(Math.random() * 100) }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== MUSIC API ====================
      if (path === '/api/music' && request.method === 'GET') {
        const music = await env.DB.prepare('SELECT * FROM music ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(music.results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/music' && request.method === 'POST') {
        if (!isAdmin()) return unauthorized();
        const body = await request.json();
        const { title, artist, description, cover, audio_url } = body;
        
        const result = await env.DB.prepare('INSERT INTO music (title, artist, description, cover, audio_url) VALUES (?, ?, ?, ?, ?)').bind(
          title, artist, description, cover, audio_url
        ).run();
        
        const newMusic = await env.DB.prepare('SELECT * FROM music WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newMusic), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/music\/\d+$/) && request.method === 'DELETE') {
        if (!isAdmin()) return unauthorized();
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM music WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== PHOTOGRAPHY API ====================
      if (path === '/api/photography' && request.method === 'GET') {
        const photos = await env.DB.prepare('SELECT * FROM photography ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(photos.results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/photography' && request.method === 'POST') {
        if (!isAdmin()) return unauthorized();
        const body = await request.json();
        const { title, location, time, description, data } = body;
        
        const result = await env.DB.prepare('INSERT INTO photography (title, location, time, description, data) VALUES (?, ?, ?, ?, ?)').bind(
          title, location, time, description, data
        ).run();
        
        const newPhoto = await env.DB.prepare('SELECT * FROM photography WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newPhoto), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/photography\/\d+$/) && request.method === 'DELETE') {
        if (!isAdmin()) return unauthorized();
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM photography WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== COMMENTS API ====================
      if (path === '/api/comments' && request.method === 'GET') {
        const comments = await env.DB.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(comments.results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/comments' && request.method === 'POST') {
        if (!isAdmin()) return unauthorized();
        const body = await request.json();
        const { nickname, content, time } = body;
        
        const result = await env.DB.prepare('INSERT INTO comments (nickname, content, time) VALUES (?, ?, ?)').bind(
          nickname, content, time || new Date().toISOString()
        ).run();
        
        const newComment = await env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newComment), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/comments\/\d+$/) && request.method === 'DELETE') {
        if (!isAdmin()) return unauthorized();
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== VOICE API ====================
      if (path === '/api/voice' && request.method === 'GET') {
        const recordings = await env.DB.prepare('SELECT * FROM voice_recordings ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(recordings.results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/voice' && request.method === 'POST') {
        if (!isAdmin()) return unauthorized();
        const body = await request.json();
        const { title, description, audio_data, duration, time } = body;
        
        const result = await env.DB.prepare('INSERT INTO voice_recordings (title, description, audio_data, duration, time) VALUES (?, ?, ?, ?, ?)').bind(
          title, description, audio_data, duration, time
        ).run();
        
        const newRecording = await env.DB.prepare('SELECT * FROM voice_recordings WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newRecording), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/voice\/\d+$/) && request.method === 'DELETE') {
        if (!isAdmin()) return unauthorized();
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM voice_recordings WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== 站点数据同步 ====================
      if (path === '/api/site' && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT value FROM site_settings WHERE key = ?').bind('site').first();
        return new Response(JSON.stringify(row ? JSON.parse(row.value) : {}), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/site' && request.method === 'PUT') {
        if (!isAdmin()) return unauthorized();
        const body = await request.json();
        await env.DB.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value').bind(
          'site', JSON.stringify(body)
        ).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== BACKUP API ====================
      if (path === '/api/backup' && request.method === 'GET') {
        if (!isAdmin()) return unauthorized();
        const posts = await env.DB.prepare('SELECT * FROM posts').all();
        const music = await env.DB.prepare('SELECT * FROM music').all();
        const photography = await env.DB.prepare('SELECT * FROM photography').all();
        const comments = await env.DB.prepare('SELECT * FROM comments').all();
        const voice_recordings = await env.DB.prepare('SELECT * FROM voice_recordings').all();
        
        return new Response(JSON.stringify({
          posts: posts.results,
          music: music.results,
          photography: photography.results,
          comments: comments.results,
          voice_recordings: voice_recordings.results,
          exported_at: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== HEALTH CHECK ====================
      if (path === '/api/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          database: 'connected',
          version: 'v7-site-sync',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== DEFAULT ====================
      return new Response(JSON.stringify({ 
        error: 'Not found',
        path: path,
        method: request.method
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
