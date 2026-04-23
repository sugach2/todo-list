async function loadTodos(userId) {
  if (!userId) {
    return [];
  }

  const response = await fetch('/api/todos', {
    method: 'GET',
    headers: {
      'x-user-id': userId,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to load todos: ${text}`);
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
    const text = await response.text();
    throw new Error(`Failed to save todo: ${text}`);
  }

  return await response.json();
}

async function updateTodo(userId, id, done) {
  if (!userId) {
    throw new Error('Missing userId');
  }

  const response = await fetch('/api/todos', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ id, done }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update todo: ${text}`);
  }

  return await response.json();
}

async function deleteTodoFromServer(userId, id) {
  if (!userId) {
    throw new Error('Missing userId');
  }

  const response = await fetch('/api/todos', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to delete todo: ${text}`);
  }

  return await response.json();
}