function getStorageKey(userId) {
  if (!userId) {
    return 'todos_guest';
  }

  return `todos_${userId}`;
}

function loadTodos(userId) {
  const key = getStorageKey(userId);
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveTodos(userId, todos) {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(todos));
}