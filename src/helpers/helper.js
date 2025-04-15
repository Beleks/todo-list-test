function initEmptyTask() {
  // priorityId -> priorityKey?
  return {
    id: null,
    content: '',
    priorityId: '1',
    isReady: false,
  }
}

function generateTaskId() {
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
}

function adjustHeight(textareaRef) {
  textareaRef.style.height = 'auto'
  textareaRef.style.height = `${textareaRef.scrollHeight}px`
}

const debounce = (func, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

function saveTaskListToLS(taskList) {
  localStorage.setItem('tasks', JSON.stringify(taskList))
}

function getTaskListFromLS() {
  let taskListFromLS = JSON.parse(localStorage.getItem('tasks'))

  if (taskListFromLS) {
    return JSON.parse(localStorage.getItem('tasks'))
  } else {
    return []
  }
}

export {
  initEmptyTask,
  generateTaskId,
  debounce,
  adjustHeight,
  saveTaskListToLS,
  getTaskListFromLS,
}
