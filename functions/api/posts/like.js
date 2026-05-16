export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  if (request.method === 'POST') {
    const body = await request.json();
    const { id } = body;

    await DB.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').bind(parseInt(id)).run();
    
    const { results } = await DB.prepare('SELECT likes FROM posts WHERE id = ?').bind(parseInt(id)).all();
    
    return new Response(JSON.stringify({ success: true, likes: results[0]?.likes || 0 }), {
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