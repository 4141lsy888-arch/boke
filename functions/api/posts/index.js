export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    if (!DB) {
      return new Response(JSON.stringify({ 
        error: 'Database binding not found' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }

    if (request.method === 'GET') {
      const { results } = await DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
      const parsed = results.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]')
      }));
      return new Response(JSON.stringify(parsed), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const { content, images, type } = body;
      
      const result = await DB.prepare(
        'INSERT INTO posts (content, images, type) VALUES (?, ?, ?)'
      ).bind(
        content || '',
        JSON.stringify(images || []),
        type || 'text'
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
    }

    if (request.method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      
      await DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  }
}
