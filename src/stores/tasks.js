import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { saveTaskListToLS, getTaskListFromLS, generateTaskId } from '@/helpers/helper.js'

export const useTasksStore = defineStore('tasks', () => {
  const allTasks = ref(getTaskListFromLS())

  watch(
    allTasks,
    (newTaskList) => {
      saveTaskListToLS(newTaskList)
    },
    { deep: true },
  )

  function createTask(newTask) {
    newTask.id = generateTaskId()
    allTasks.value.unshift(newTask)
  }

  function saveEditTask(newTask) {
    let currentTaskIndex = allTasks.findIndex((task) => task.id === newTask.id)
    if (currentTaskIndex === -1) {
      return
    }

    allTasks.splice(currentTaskIndex, 1, newTask)
  }

  function deleteTaskById(taskId) {
    let currentTaskIndex = allTasks.value.findIndex((task) => task.id === taskId)
    if (currentTaskIndex === -1) {
      return
    }

    allTasks.value.splice(currentTaskIndex, 1)
  }

  function completeTask(task) {
    task.isReady = true
  }

  const taskPriorities = ref({
    1: {
      title: 'Низкий',
      class: 'stroke-blue-400',
      activeClass: 'text-blue-400',
    },
    2: {
      title: 'Средний',
      class: 'stroke-yellow-400',
      activeClass: 'text-yellow-400',
    },
    3: {
      title: 'Высокий',
      class: 'stroke-red-400',
      activeClass: 'text-red-400',
    },
  })

  const statusTypes = ref({
    all: {
      title: 'Все задачи',
      checkQuality() {
        return true
      },
    },
    active: {
      title: 'Активные',
      checkQuality(task) {
        return !task.isReady
      },
    },
    completed: {
      title: 'Завершенные',
      checkQuality(task) {
        return task.isReady
      },
    },
  })

  return {
    allTasks,
    createTask,
    deleteTaskById,
    saveEditTask,
    completeTask,
    taskPriorities,
    statusTypes,
  }
})
