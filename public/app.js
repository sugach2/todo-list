const LIFF_ID = '2009857882-k35E4UJr';

let todos = [];
let currentUserId = null;
let isSaving = false;

function animateTodoPop(index) {
  requestAnimationFrame(() => {
    const target = document.querySelector(`.todo-item[data-index="${index}"]`);
    if (!target) return;

    target.classList.remove('popping');
    void target.offsetWidth;
    target.classList.add('popping');

    setTimeout(() => {
      target.classList.remove('popping');
    }, 220);
  });
}

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

async function handleAdd() {
  try {
    const text = todoInput.value.trim();
    if (!text || !currentUserId || isSaving) return;

    isSaving = true;

    const tempTodo = {
      id: `temp-${Date.now()}`,
      text,
      done: false,
      created_at: new Date().toISOString()
    };

    todos.unshift(tempTodo);
    renderTodos(todos, handleToggle, handleDelete);

    todoInput.value = '';
    todoInput.blur();

    const created = await saveTodo(currentUserId, text);

    if (Array.isArray(created) && created.length > 0) {
      todos[0] = created[0];
      renderTodos(todos, handleToggle, handleDelete);
    }
  } catch (error) {
    console.error('Failed to add todo:', error);
    todos = todos.filter(todo => !String(todo.id).startsWith('temp-'));
    renderTodos(todos, handleToggle, handleDelete);
    alert(error.message);
  } finally {
    isSaving = false;
  }
}

async function handleToggle(index) {
  const todo = todos[index];
  if (!todo || !currentUserId) return;

  const oldDone = todo.done;
  todos[index].done = !oldDone;
  renderTodos(todos, handleToggle, handleDelete);
  animateTodoPop(index);

  try {
    await updateTodo(currentUserId, todo.id, !oldDone);
  } catch (error) {
    console.error('Failed to toggle todo:', error);
    todos[index].done = oldDone;
    renderTodos(todos, handleToggle, handleDelete);
    alert(error.message);
  }
}

async function handleDelete(index) {
  const todo = todos[index];
  if (!todo || !currentUserId) return;

  const deletedTodo = todos[index];
  todos.splice(index, 1);
  renderTodos(todos, handleToggle, handleDelete);

  try {
    await deleteTodoFromServer(currentUserId, deletedTodo.id);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    todos.splice(index, 0, deletedTodo);
    renderTodos(todos, handleToggle, handleDelete);
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