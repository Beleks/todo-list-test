<script setup>
import { computed, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

import { useSettingsStore } from '@/stores/settings.js'
import { useTasksStore } from '@/stores/tasks.js'
import { debounce } from '@/helpers/helper.js'

import IconCircle from '@/components/icons/IconCircle.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import TaskForm from '@/components/TaskForm.vue'
import IconPriority from '@/components/icons/IconPriority.vue'

const settingsStore = useSettingsStore()
const tasksStore = useTasksStore()

const filters = ref({
  priorities: new Set(['2', '3']),
  statusType: 'all',
})

const inputTaskSearch = ref('')
const currentPage = ref(1)
const editTaskId = ref(null)

const allTasks = tasksStore.allTasks
const filteredBySearch = ref([])

watch(
  allTasks,
  (newTaskList) => {
    filteredBySearch.value = filteredByTaskContent(inputTaskSearch.value, newTaskList)
  },
  { deep: true, immediate: true },
)

watch(
  [filters, inputTaskSearch],
  () => {
    currentPage.value = 1
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

  result = result.filter((task) =>
    settingsStore.statusTypes[filters.value.statusType].checkQuality(task),
  )
  return result
})

const totalPages = computed(() => Math.ceil(filteredTasks.value.length / settingsStore.tasksOnPage))

const slicedTaskArray = computed(() => {
  let start = (currentPage.value - 1) * settingsStore.tasksOnPage
  let end = start + settingsStore.tasksOnPage
  return filteredTasks.value.slice(start, end)
})

watch(slicedTaskArray, (newTaskArray) => {
  // Для перехода на предыдущую страницу, если на текущей нет задач
  if (newTaskArray.length === 0 && currentPage.value !== 1) {
    currentPage.value = currentPage.value - 1
  }
})

const debounceSearch = debounce(() => {
  filteredBySearch.value = filteredByTaskContent(inputTaskSearch.value, allTasks)
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

function onCreateTask(newTask) {
  tasksStore.createTask(newTask)
}

function onSaveEditTask(newTask) {
  tasksStore.saveEditTask(newTask)
  editTaskId.value = null
}

function onCompleteTask(task) {
  tasksStore.completeTask(task)
  toast.success('Задача выполнена!')
}

function onDeleteTask(taskId) {
  tasksStore.deleteTaskById(taskId)
  toast('Задача удалена')
}
</script>

<template>
  <div class="flex mt-6 gap-2.5">
    <input
      type="text"
      @input="debounceSearch"
      class="outline-none border border-gray-400 placeholder:text-gray-400 w-full md:ml-9 p-2.5 rounded-sm"
      placeholder="Поиск по названию"
      v-model="inputTaskSearch"
    />
    <!--    <button-->
    <!--      class="py-2.5 px-6 font-medium bg-purple-400 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"-->
    <!--    >-->
    <!--      Поиск-->
    <!--    </button>-->
  </div>
  <div class="mt-2.5 md:ml-9 flex gap-1 justify-between border-gray-400 flex-col lg:flex-row">
    <div class="lg:block">Фильтры:</div>
    <div
      class="flex gap-2.5 items-stretch text-sm text-center flex-col w-full lg:w-fit lg:flex-row"
    >
      <div
        v-for="(priority, key) in settingsStore.taskPriorities"
        @click="changePrioritiesFilter(key)"
        class="flex items-center gap-1.5 cursor-pointer border py-1 px-2.5 rounded-sm"
        :class="[filters.priorities.has(key) ? priority.activeClass : 'border-gray-400']"
      >
        <IconPriority
          :class="[filters.priorities.has(key) ? priority.class : 'stroke-gray-400']"
          class="stroke-1"
          :size="20"
        />
        {{ priority.title }}
      </div>
      <div class="flex border rounded-sm divide-x border-gray-400">
        <div
          class="py-1 px-2.5 cursor-pointer grow border-gray-400"
          :class="[filters.statusType === key ? 'text-purple-400 ' : '']"
          v-for="(status, key) in settingsStore.statusTypes"
          @click="changeStatusFilter(key)"
        >
          {{ status.title }}
        </div>
      </div>
    </div>
  </div>
  <div class="flex gap-2.5 mt-2.5">
    <TaskForm class="md:ml-9" @createTask="onCreateTask"></TaskForm>
  </div>
  <div>
    <div class="mt-4" v-for="task in slicedTaskArray">
      <div class="flex gap-2.5 items-center">
        <template v-if="editTaskId === task.id">
          <TaskForm
            class="md:ml-9"
            isEdit
            :task="task"
            @cancelChange="cancelChange"
            @editTask="onSaveEditTask"
          ></TaskForm>
        </template>
        <template v-else>
          <div
            class="cursor-pointer stroke-2"
            :class="[settingsStore.taskPriorities[task.priorityId].class]"
          >
            <IconCheck v-if="task.isReady" @click="task.isReady = false" :size="26" />
            <IconCircle v-else @click="onCompleteTask(task)" :size="26" />
          </div>
          <div class="flex justify-between p-2.5 border border-gray-400 rounded-sm w-full">
            <div :class="task.isReady ? 'line-through' : ''">
              {{ task.content }}
            </div>
            <div class="flex gap-2.5 stroke-2">
              <IconEdit
                :size="24"
                class="stroke-purple-400 cursor-pointer"
                @click="showTaskForm(task.id)"
              />
              <IconTrash
                :size="24"
                class="stroke-red-400 cursor-pointer"
                @click="onDeleteTask(task.id)"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-show="slicedTaskArray.length" class="flex justify-center mt-4">
    <div class="flex border rounded-sm divide-x *:w-10 *:p-2.5 *:cursor-pointer">
      <button
        class="disabled:cursor-not-allowed"
        @click="currentPage--"
        :disabled="currentPage <= 1"
      >
        <
      </button>
      <!-- TODO: Ограничения по кол-ву видимых страниц? -->
      <div
        class="p-2.5 text-center"
        :class="[currentPage === page ? 'bg-purple-400' : '']"
        v-for="page in totalPages"
        @click="currentPage = page"
      >
        {{ page }}
      </div>
      <button
        class="disabled:cursor-not-allowed"
        @click="currentPage++"
        :disabled="currentPage >= totalPages"
      >
        >
      </button>
    </div>
  </div>
</template>

<style scoped></style>
