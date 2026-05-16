export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    if (!DB) {
      return new Response(JSON.stringify({ 
        error: 'Database binding not found. Please ensure D1 database is properly configured.' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (request.method === 'GET') {
      const { results } = await DB.prepare(
        'SELECT * FROM posts ORDER BY created_at DESC'
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const { title, content, images, tags } = body;

        if (!title && !content) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Title or content is required' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

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
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message || 'Failed to create post' 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
