function addTodo(todos, text) {
  todos.push({
    text,
    done: false
  });
}

function toggleTodo(todos, index) {
  todos[index].done = !todos[index].done;
}

function deleteTodo(todos, index) {
  todos.splice(index, 1);
}