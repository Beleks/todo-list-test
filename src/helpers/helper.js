import { useSettingsStore } from '@/stores/settings.js'
import i18n from '@/i18n/index.js'

const { t } = i18n.global

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

function handleImportTasks(tasks) {
  //Кажется, что это даёт гаранитю инициализации store
  const settingsStore = useSettingsStore()

  const emptyTask = initEmptyTask()
  return tasks.map((task) => {
    let transformedTask = {}

    Object.keys(emptyTask).forEach((key) => {
      switch (key) {
        case 'id':
          transformedTask[key] = generateTaskId()
          break
        case 'priorityId':
          if (task[key] in settingsStore.taskPriorities) {
            transformedTask[key] = task[key]
          } else {
            throw new Error(t('errorKey', { key: key, keyValue: task[key] }))
          }
          break
        case 'isReady':
          transformedTask[key] = !!task[key]
          break
        default:
          if (task[key] === undefined) {
            throw new Error(t('errorMissKey', { key: key }))
          }
          transformedTask[key] = task[key]
          break
      }
    })

    return transformedTask
  })
}

function isArrayOfObjects(arr) {
  return Array.isArray(arr) && arr.every((item) => item !== null && typeof item === 'object')
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

function getJSONTaskListFromLS() {
  return localStorage.getItem('tasks')
}

function getTaskListFromLS() {
  return JSON.parse(getJSONTaskListFromLS()) || []
}

export {
  initEmptyTask,
  generateTaskId,
  handleImportTasks,
  debounce,
  adjustHeight,
  getJSONTaskListFromLS,
  saveTaskListToLS,
  getTaskListFromLS,
  isArrayOfObjects,
}
