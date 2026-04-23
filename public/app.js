const LIFF_ID = '2009857882-k35E4UJr';

let todos = [];
let currentUserId = null;

async function initLiff() {
  const subtitle = document.querySelector('.header-subtitle');

  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();

    currentUserId = profile.userId;
    subtitle.textContent = `${profile.displayName} さんのToDo`;

    todos = await loadTodos(currentUserId);
    renderTodos(todos, handleToggle, handleDelete);
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    subtitle.textContent = 'LINEミニアプリ風のシンプルToDo';
    alert(error.message);
  }
}

async function refreshFromServer() {
  todos = await loadTodos(currentUserId);
  renderTodos(todos, handleToggle, handleDelete);
}

async function handleAdd() {
  try {
    const text = todoInput.value.trim();
    if (!text || !currentUserId) return;

    await saveTodo(currentUserId, text);
    todoInput.value = '';
    todoInput.blur();
    await refreshFromServer();
  } catch (error) {
    console.error('Failed to add todo:', error);
    alert(error.message);
  }
}

async function handleToggle(index) {
  try {
    const todo = todos[index];
    if (!todo || !currentUserId) return;

    await updateTodo(currentUserId, todo.id, !todo.done);
    await refreshFromServer();
  } catch (error) {
    console.error('Failed to toggle todo:', error);
    alert(error.message);
  }
}

async function handleDelete(index) {
  try {
    const todo = todos[index];
    if (!todo || !currentUserId) return;

    await deleteTodoFromServer(currentUserId, todo.id);
    await refreshFromServer();
  } catch (error) {
    console.error('Failed to delete todo:', error);
    alert(error.message);
  }
}

addBtn.addEventListener('click', handleAdd);

todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    todoInput.blur();
  }
});

renderTodos(todos, handleToggle, handleDelete);
initLiff();