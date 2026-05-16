export async function onRequest(context) {
  const { request, env, params } = context;
  const { DB } = env;
  const { id } = params;

  if (request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM posts WHERE id = ?').bind(parseInt(id)).all();
    
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

  if (request.method === 'PUT') {
    const body = await request.json();
    const { title, content, images, tags } = body;

    await DB.prepare(
      'UPDATE posts SET title = ?, content = ?, images = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(
      title || '',
      content || '',
      JSON.stringify(images || []),
      JSON.stringify(tags || []),
      parseInt(id)
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (request.method === 'DELETE') {
    await DB.prepare('DELETE FROM posts WHERE id = ?').bind(parseInt(id)).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
}