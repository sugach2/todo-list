export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }

  const userId = req.headers['x-user-id'];

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const commonHeaders = {
    apikey: supabaseSecretKey,
    Authorization: `Bearer ${supabaseSecretKey}`,
    'Content-Type': 'application/json',
  };

  try {
    if (req.method === 'GET') {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/todos?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`,
        {
          headers: commonHeaders,
        }
      );

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === 'POST') {
      const { text } = req.body || {};

      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Missing text' });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/todos`, {
        method: 'POST',
        headers: {
          ...commonHeaders,
          Prefer: 'return=representation',
        },
        body: JSON.stringify([
          {
            user_id: userId,
            text,
            done: false,
          },
        ]),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === 'PATCH') {
      const { id, done } = req.body || {};

      if (!id || typeof done !== 'boolean') {
        return res.status(400).json({ error: 'Missing id or done' });
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/todos?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`,
        {
          method: 'PATCH',
          headers: {
            ...commonHeaders,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ done }),
        }
      );

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};

      if (!id) {
        return res.status(400).json({ error: 'Missing id' });
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/todos?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`,
        {
          method: 'DELETE',
          headers: {
            ...commonHeaders,
            Prefer: 'return=representation',
          },
        }
      );

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected server error',
      detail: error.message,
    });
  }
}