<script setup>
import { ref, useTemplateRef, watch } from 'vue'

const taskContentArea = useTemplateRef('taskContentArea')

// const taskContent = ref('')
const taskPriorities = ref([
  { id: 1, title: 'Низкий', activeClass: 'text-purple-400' },
  { id: 2, title: 'Средний', activeClass: 'text-purple-400' },
  { id: 3, title: 'Высокий', activeClass: 'text-purple-400' },
])

const newTask = ref(initEmptyTask())
const isEdite = ref(true)

watch(isEdite, (newValueIsEdite) => {
  if (!newValueIsEdite) {
    newTask.value = initEmptyTask()
    // Нужно ли терять с input фокус? Для удобства вродебы нет
    // taskContentArea.value.blur()
  }
})

function initEmptyTask() {
  return {
    content: '',
    priorityId: 1,
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
  if (task.content.length) {
    // TODO: Убрать лишние пробелы, переносы строк?
    isEdite.value = false
    console.log(task)
    // create...
  }
}

function adjustHeight(event) {
  // Сброс высоты, чтобы корректно вычислить новую высоту
  event.target.style.height = 'auto'
  // Установка новой высоты на основе содержимого
  event.target.style.height = `${event.target.scrollHeight}px`
}
</script>

<template>
  <div>Поиск</div>
  <div>Фильтры</div>
  <div class="p-2.5 border rounded-sm" :class="{ 'border-dashed': isEdite }">
    <div>
      <!-- Без p-0 Placeholder изначально не видно -->
      <textarea
        ref="taskContentArea"
        class="block w-full p-0 focus:border-none outline-none resize-none"
        placeholder="Название задачи..."
        rows="1"
        @input="adjustHeight"
        @keyup.alt.enter="createTask(newTask)"
        @focus="onFocus"
        v-model="newTask.content"
      ></textarea>
    </div>
    <div v-if="isEdite" class="flex items-center justify-between leading-4 mt-2.5">
      <div class="flex gap-2.5">
        Приоритет:
        <div
          v-for="priority in taskPriorities"
          @click="choosePriority(priority.id)"
          :class="{ [priority.activeClass]: priority.id === newTask.priorityId }"
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
  <div>Список задач</div>
  <div>Пагинация</div>
</template>

<style scoped></style>
