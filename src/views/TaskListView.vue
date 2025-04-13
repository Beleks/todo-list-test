<script setup>
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings.js'

import IconCircle from '@/components/icons/IconCircle.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import TaskForm from '@/components/TaskForm.vue'
import IconEdit from '@/components/icons/IconEdit.vue'

// const taskContent = ref('')

const settingsStore = useSettingsStore()

const editTaskId = ref(null)

const taskList = ref([])

function showTaskForm(taskId) {
  editTaskId.value = taskId
}

function cancelChange() {
  editTaskId.value = null
}

function saveEditTask(newTask) {

}

function createTask(task) {
  task.id = generateId()
  taskList.value.unshift(task)
  saveTaskListToLS(taskList.value)
}

function saveTaskListToLS(taskList) {
  localStorage.setItem('tasks', JSON.stringify(taskList))
}

function deleteTask(taskId) {
  let currentTaskIndex = taskList.value.findIndex((task) => task.id === taskId)
  if (currentTaskIndex === -1) {
    return
  }

  taskList.value.splice(currentTaskIndex, 1)
  saveTaskListToLS(taskList.value)
}

function generateId() {
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
}

onMounted(() => {
  let taskListFromLS = JSON.parse(localStorage.getItem('tasks'))

  if (taskListFromLS) {
    taskList.value = taskListFromLS
  }
})
</script>

<template>
  <div>Поиск</div>
  <div>Фильтры</div>
  <div class="flex gap-2.5">
    <IconCheck :size="26" />
    <TaskForm @createTask="createTask"></TaskForm>
  </div>
  <div>
    <div class="mt-4" v-for="task in taskList">
      <div
        class="flex gap-2.5 items-center"
      >
        <template v-if="editTaskId === task.id">
          <IconCheck :size="26" />
          <TaskForm isEdit :task="task" @cancelChange="cancelChange" @editTask="saveEditTask"></TaskForm>
        </template>
        <template v-else>
          <div class="cursor-pointer" :class="[settingsStore.taskPriorities[task.priorityId].class]">
            <IconCheck v-if="task.isReady" @click="task.isReady = !task.isReady" :size="26" />
            <IconCircle v-else @click="task.isReady = !task.isReady" :size="26" />
          </div>
          <div class="flex justify-between p-2.5 border border-gray-400 rounded-sm w-full">
            <div>
              {{ task.content }}
            </div>
            <div class="flex gap-2.5">
              <IconEdit
                :size="24"
                class="stroke-purple-400 cursor-pointer"
                @click="showTaskForm(task.id)"
              />
              <IconTrash
                :size="24"
                class="stroke-red-400 cursor-pointer"
                @click="deleteTask(task.id)"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div>Пагинация</div>
</template>

<style scoped></style>
