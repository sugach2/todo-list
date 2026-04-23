const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoListActive = document.getElementById('todoListActive');
const todoListDone = document.getElementById('todoListDone');
const emptyActive = document.getElementById('emptyActive');
const emptyDone = document.getElementById('emptyDone');
const activeTitle = document.getElementById('activeTitle');
const doneTitle = document.getElementById('doneTitle');

function createTodoItem(todo, index, onToggle, onDelete) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.index = index;

  if (todo.done) {
    li.classList.add('done');
  }

  const checkBtn = document.createElement('button');
  checkBtn.className = 'check-btn';
  checkBtn.addEventListener('click', () => onToggle(index));

  const text = document.createElement('span');
  text.textContent = todo.text;
  text.className = 'todo-text';
  text.addEventListener('click', () => onToggle(index));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => onDelete(index));

  li.appendChild(checkBtn);
  li.appendChild(text);
  li.appendChild(deleteBtn);

  return li;
}

function renderTodos(todos, onToggle, onDelete) {
  todoListActive.innerHTML = '';
  todoListDone.innerHTML = '';

  let activeCount = 0;
  let doneCount = 0;

  todos.forEach((todo, index) => {
    const li = createTodoItem(todo, index, onToggle, onDelete);

    if (todo.done) {
      todoListDone.appendChild(li);
      doneCount += 1;
    } else {
      todoListActive.appendChild(li);
      activeCount += 1;
    }
  });

  if (activeTitle) {
    activeTitle.textContent = `未完了（${activeCount}）`;
  }

  if (doneTitle) {
    doneTitle.textContent = `完了済み（${doneCount}）`;
  }

  emptyActive.style.display = activeCount === 0 ? 'block' : 'none';
  emptyDone.style.display = doneCount === 0 ? 'block' : 'none';
}