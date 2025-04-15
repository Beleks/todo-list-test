import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { saveTaskListToLS, getTaskListFromLS, generateTaskId } from '@/helpers/helper.js'

export const useTasksStore = defineStore('tasks', () => {
  // TODO: объединить saveEditTask и deleteTaskById?

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
    addTasks([newTask])
  }
  
  function addTasks(newTaskArr) {
    allTasks.value.unshift(...newTaskArr)
  }

  function saveEditTask(newTask) {
    let currentTaskIndex = allTasks.value.findIndex((task) => task.id === newTask.id)
    if (currentTaskIndex === -1) {
      return
    }

    allTasks.value.splice(currentTaskIndex, 1, newTask)
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

  return {
    allTasks,
    createTask,
    addTasks,
    deleteTaskById,
    saveEditTask,
    completeTask,
  }
})
