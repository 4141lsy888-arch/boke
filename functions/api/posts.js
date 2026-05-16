export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (request.method === 'POST') {
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

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}