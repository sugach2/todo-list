async function loadTodos(userId) {
  if (!userId) {
    return [];
  }

  const response = await fetch('/api/todos', {
    headers: {
      'x-user-id': userId,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load todos');
  }

  return await response.json();
}

async function saveTodo(userId, text) {
  if (!userId) {
    throw new Error('Missing userId');
  }

  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to save todo');
  }

  return await response.json();
}