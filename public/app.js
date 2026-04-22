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

    todos = loadTodos(currentUserId);
    refresh();
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    subtitle.textContent = 'LINEミニアプリ風のシンプルToDo';
  }
}

function refresh() {
  saveTodos(currentUserId, todos);
  renderTodos(todos, handleToggle, handleDelete);
}

function handleAdd() {
  const text = todoInput.value.trim();
  if (!text) return;

  addTodo(todos, text);
  todoInput.value = '';
  todoInput.blur();
  refresh();
}

function handleToggle(index) {
  toggleTodo(todos, index);
  refresh();
}

function handleDelete(index) {
  deleteTodo(todos, index);
  refresh();
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