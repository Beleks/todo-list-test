<script setup>
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import IconCircle from '@/components/icons/IconCircle.vue'
import IconCheck from '@/components/icons/IconCheck.vue'

const taskContentArea = useTemplateRef('taskContentArea')

// const taskContent = ref('')

const taskPriorities= ref({
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

const newTask = ref(initEmptyTask())
const isEdite = ref(false)

const taskList = ref([])

watch(isEdite, (newValueIsEdite) => {
  if (!newValueIsEdite) {
    newTask.value = initEmptyTask()
  }
})

function initEmptyTask() {
  // priorityId -> priorityKey?
  return {
    content: '',
    priorityId: '1',
    isReady: false,
  }
}

function choosePriority(priorityId) {
  newTask.value.priorityId = priorityId
}

function onFocus() {
  isEdite.value = true
}

function cancelEdit() {
  isEdite.value = false
}

function createTask(task) {
  if (!task.content.length) {
    return
  }

  // TODO: Убрать лишние пробелы, переносы строк?
  // create...
  taskList.value.unshift(task)

  // taskList.value.splice(0, 0, task)
  localStorage.setItem('tasks', JSON.stringify(taskList.value))

  newTask.value = initEmptyTask()
}

function adjustHeight(event) {
  // Сброс высоты, чтобы корректно вычислить новую высоту
  event.target.style.height = 'auto'
  // Установка новой высоты на основе содержимого
  event.target.style.height = `${event.target.scrollHeight}px`
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
    <div class="">
      <IconCheck :size="26" />
    </div>
    <div class="p-2.5 border border-gray-400 rounded-sm w-full" :class="{ 'border-dashed': isEdite }">
        <!-- Без p-0 Placeholder изначально не видно FIXED? -->
        <textarea
          ref="taskContentArea"
          class="block w-full placeholder:text-gray-400 focus:border-none outline-none resize-none"
          placeholder="Введите название задачи..."
          rows="1"
          @input="adjustHeight"
          @keyup.alt.enter="createTask(newTask)"
          @focus="onFocus"
          v-model="newTask.content"
        ></textarea>
      <div v-if="isEdite" class="flex items-center justify-between leading-4 mt-2.5">
        <div class="flex gap-2.5">
          Приоритет:
          <div
            v-for="(priority, key) in taskPriorities"
            @click="choosePriority(key)"
            :class="[newTask.priorityId === key ? priority.activeClass : '']"
            class="cursor-pointer"
          >
            {{ priority.title }}
          </div>
        </div>
        <div class="flex gap-2.5 items-center font-medium">
          <button class="p-2.5 bg-gray-800 rounded-sm cursor-pointer" @click="cancelEdit">
            Отмена
          </button>
          <button
            class="p-2.5 bg-purple-400 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!newTask.content"
            @click="createTask(newTask)"
          >
            Добавить задачу
          </button>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="mt-4" v-for="task in taskList">
      <div class="flex gap-2.5 items-center" :class="[taskPriorities[task.priorityId].class]">
        <div class="cursor-pointer">
          <IconCheck v-if="task.isReady" @click="task.isReady = !task.isReady" :size="26" />
          <IconCircle v-else @click="task.isReady = !task.isReady" :size="26" />
        </div>
        <div class="p-2.5 border border-gray-400 rounded-sm w-full">
          {{ task.content }}
        </div>
      </div>
    </div>
  </div>
  <div>Пагинация</div>
</template>

<style scoped></style>
