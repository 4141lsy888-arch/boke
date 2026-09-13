export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  if (request.method === 'POST') {
    const body = await request.json();
    const { id } = body;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Liking feature not available in current schema',
      likes: 0 
    }), {
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