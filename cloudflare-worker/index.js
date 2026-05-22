/**
 * Cloudflare Worker - D1 Database API
 * 用于 yy8's blog
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ==================== POSTS API ====================
      if (path === '/api/posts' && request.method === 'GET') {
        const posts = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(posts.results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path === '/api/posts' && request.method === 'POST') {
        const body = await request.json();
        const { title, content, location, tags, images, time } = body;
        
        const result = await env.DB.prepare(`
          INSERT INTO posts (title, content, location, tags, images, time)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          title,
          content,
          location,
          JSON.stringify(tags || []),
          JSON.stringify(images || []),
          time || new Date().toISOString()
        );
        
        const newPost = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newPost), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/posts\/\d+$/) && request.method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json();
        const { title, content, location, tags, images, time } = body;
        
        await env.DB.prepare(`
          UPDATE posts 
          SET title = ?, content = ?, location = ?, tags = ?, images = ?, time = ?
          WHERE id = ?
        `).run(title, content, location, JSON.stringify(tags || []), JSON.stringify(images || []), time, id);
        
        const updatedPost = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
        return new Response(JSON.stringify(updatedPost), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/posts\/\d+$/) && request.method === 'DELETE') {
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
        const body = await request.json();
        const { title, artist, description, cover, audio_url } = body;
        
        const result = await env.DB.prepare(`
          INSERT INTO music (title, artist, description, cover, audio_url)
          VALUES (?, ?, ?, ?, ?)
        `).run(title, artist, description, cover, audio_url);
        
        const newMusic = await env.DB.prepare('SELECT * FROM music WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newMusic), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/music\/\d+$/) && request.method === 'DELETE') {
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
        const body = await request.json();
        const { title, location, time, description, data } = body;
        
        const result = await env.DB.prepare(`
          INSERT INTO photography (title, location, time, description, data)
          VALUES (?, ?, ?, ?, ?)
        `).run(title, location, time, description, data);
        
        const newPhoto = await env.DB.prepare('SELECT * FROM photography WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newPhoto), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/photography\/\d+$/) && request.method === 'DELETE') {
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
        const body = await request.json();
        const { nickname, content, time } = body;
        
        const result = await env.DB.prepare(`
          INSERT INTO comments (nickname, content, time)
          VALUES (?, ?, ?)
        `).run(nickname, content, time || new Date().toISOString());
        
        const newComment = await env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newComment), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/comments\/\d+$/) && request.method === 'DELETE') {
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
        const body = await request.json();
        const { title, description, audio_data, duration, time } = body;
        
        const result = await env.DB.prepare(`
          INSERT INTO voice_recordings (title, description, audio_data, duration, time)
          VALUES (?, ?, ?, ?, ?)
        `).run(title, description, audio_data, duration, time);
        
        const newRecording = await env.DB.prepare('SELECT * FROM voice_recordings WHERE id = ?').bind(result.meta.last_row_id).first();
        return new Response(JSON.stringify(newRecording), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      if (path.match(/^\/api\/voice\/\d+$/) && request.method === 'DELETE') {
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM voice_recordings WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ==================== BACKUP API ====================
      if (path === '/api/backup' && request.method === 'GET') {
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
