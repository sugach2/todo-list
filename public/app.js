const LIFF_ID = '2009857882-k35E4UJr';

let todos = [];
let currentUserId = null;

function setDebugMessage(message) {
  const debugMessage = document.getElementById('debugMessage');
  if (debugMessage) {
    debugMessage.textContent = message;
  }
}

async function initLiff() {
  const subtitle = document.querySelector('.header-subtitle');

  try {
    setDebugMessage('LIFF init start');

    await liff.init({ liffId: LIFF_ID });
    setDebugMessage(`LIFF initialized / loggedIn=${liff.isLoggedIn()}`);

    if (!liff.isLoggedIn()) {
      setDebugMessage('Not logged in -> login()');
      liff.login();
      return;
    }

    setDebugMessage('Before getProfile()');
    const profile = await liff.getProfile();

    currentUserId = profile.userId;
    subtitle.textContent = `${profile.displayName} さんのToDo`;
    setDebugMessage(`Profile loaded: ${profile.displayName}`);

    todos = loadTodos(currentUserId);
    refresh();
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    subtitle.textContent = 'LIFF error';
    setDebugMessage(`LIFF error: ${error.message}`);
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