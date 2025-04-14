function initEmptyTask() {
  // priorityId -> priorityKey?
  return {
    id: null,
    content: '',
    priorityId: '1',
    isReady: false,
  }
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

export { initEmptyTask, debounce }
