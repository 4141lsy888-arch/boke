export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/api/')) {
      return handleApiRequest(request, env, path);
    }

    return handleStaticRequest(request);
  }
};

async function handleApiRequest(request, env, path) {
  const { DB } = env;
  
  if (path === '/api/posts' && request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (path === '/api/posts' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { title, content, images, tags } = body;
      
      const result = await DB.prepare(
        'INSERT INTO posts (title, content, images, tags, likes) VALUES (?, ?, ?, ?, ?)'
      ).bind(
        title || '',
        content || '',
        JSON.stringify(images || []),
        JSON.stringify(tags || []),
        0
      ).run();

      return new Response(JSON.stringify({ 
        success: true, 
        id: result.meta.last_row_id 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }

  if (path.match(/\/api\/posts\/\d+/) && request.method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const { results } = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify(results[0]), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (path.match(/\/api\/posts\/\d+/) && request.method === 'PUT') {
    const id = parseInt(path.split('/')[3]);
    const body = await request.json();
    const { title, content, images, tags } = body;

    await DB.prepare(
      'UPDATE posts SET title = ?, content = ?, images = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(
      title || '',
      content || '',
      JSON.stringify(images || []),
      JSON.stringify(tags || []),
      id
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (path.match(/\/api\/posts\/\d+/) && request.method === 'DELETE') {
    const id = parseInt(path.split('/')[3]);
    await DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (path === '/api/posts/like' && request.method === 'POST') {
    const body = await request.json();
    const { id } = body;

    await DB.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').bind(id).run();
    
    const { results } = await DB.prepare('SELECT likes FROM posts WHERE id = ?').bind(id).all();
    
    return new Response(JSON.stringify({ success: true, likes: results[0]?.likes || 0 }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function handleStaticRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/index.html' : url.pathname;

  const fileExtension = path.split('.').pop().toLowerCase();
  const contentType = getContentType(fileExtension);

  try {
    const file = await fetch(`https://raw.githubusercontent.com/4141lsy888-arch/desktop-tutorial/main${path}`);
    
    if (!file || file.status !== 200) {
      return new Response('Not found', { status: 404 });
    }

    const body = await file.blob();
    return new Response(body, {
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

function getContentType(extension) {
  const types = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon'
  };
  return types[extension] || 'text/plain';
}