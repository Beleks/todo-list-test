<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useSettingsStore } from '@/stores/settings.js'
import { debounce } from '@/helpers/helper.js'

import IconCircle from '@/components/icons/IconCircle.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import TaskForm from '@/components/TaskForm.vue'

const settingsStore = useSettingsStore()

const filters = ref({
  priorities: new Set(['1', '2']),
  statusType: 'all',
})

const inputTaskSearch = ref('')
const editTaskId = ref(null)

const taskList = ref([])
const filteredBySearch = ref([])

watch(
  taskList,
  (newTaskList) => {
    filteredBySearch.value = filteredByTaskContent(inputTaskSearch.value, newTaskList)
  },
  { deep: true },
)

function changePrioritiesFilter(priorityKey) {
  if (filters.value.priorities.has(priorityKey)) {
    filters.value.priorities.delete(priorityKey)
  } else {
    filters.value.priorities.add(priorityKey)
  }
}

function changeStatusFilter(statusType) {
  filters.value.statusType = statusType
}

const filteredTasks = computed(() => {
  let result = filteredBySearch.value

  if (filters.value.priorities.size) {
    result = filteredBySearch.value.filter((task) => filters.value.priorities.has(task.priorityId))
  }

  result = result.filter((task)=> settingsStore.statusTypes[filters.value.statusType].checkQuality(task))
  return result
})

const debounceSearch = debounce(() => {
  filteredBySearch.value = filteredByTaskContent(inputTaskSearch.value, taskList.value)
}, 300)

function filteredByTaskContent(taskContentQuery, taskList) {
  if (taskContentQuery.length) {
    return taskList.filter((task) => task.content.includes(taskContentQuery))
  } else {
    return taskList
  }
}

function showTaskForm(taskId) {
  editTaskId.value = taskId
}

function cancelChange() {
  editTaskId.value = null
}

function saveEditTask(newTask) {
  let currentTaskIndex = taskList.value.findIndex((task) => task.id === newTask.id)
  if (currentTaskIndex === -1) {
    return
  }

  taskList.value.splice(currentTaskIndex, 1, newTask)
  saveTaskListToLS(taskList.value)

  editTaskId.value = null
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
  <div class="flex mt-6 gap-2.5">
    <!-- @keyup.enter="debounceSearch" -->
    <input
      type="text"
      @input="debounceSearch"
      class="border border-gray-400 placeholder:text-gray-400 w-full ml-9 p-2.5 rounded-sm"
      placeholder="Поиск по названию"
      v-model="inputTaskSearch"
    />
    <!--    <button-->
    <!--      class="py-2.5 px-6 font-medium bg-purple-400 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"-->
    <!--      @click="debounceSearch"-->
    <!--    >-->
    <!--      Поиск-->
    <!--    </button>-->
  </div>
  <div class="mt-2.5 ml-9 flex justify-between">
    <div>Фильтры:</div>
    <div class="flex gap-2.5">
      <div
        v-for="(priority, key) in settingsStore.taskPriorities"
        @click="changePrioritiesFilter(key)"
        :class="[filters.priorities.has(key) ? priority.activeClass : '']"
      >
        {{ priority.title }}
      </div>
      <div v-for="(status, key) in settingsStore.statusTypes" @click="changeStatusFilter(key)">
        {{ status.title }}
      </div>
    </div>
  </div>
  <div class="flex gap-2.5 mt-2.5">
    <IconCheck :size="26" />
    <TaskForm @createTask="createTask"></TaskForm>
  </div>
  <div>
    <div class="mt-4" v-for="task in filteredTasks">
      <div class="flex gap-2.5 items-center">
        <template v-if="editTaskId === task.id">
          <IconCheck :size="26" />
          <TaskForm
            isEdit
            :task="task"
            @cancelChange="cancelChange"
            @editTask="saveEditTask"
          ></TaskForm>
        </template>
        <template v-else>
          <div
            class="cursor-pointer"
            :class="[settingsStore.taskPriorities[task.priorityId].class]"
          >
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
