<script setup>
import {adjustHeight, getJSONTaskListFromLS, handleImportTasks, isArrayOfObjects} from '@/helpers/helper.js'
import { useTemplateRef } from 'vue'
import { toast } from 'vue3-toastify'
import { useTasksStore } from '@/stores/tasks.js'

const importTasksInput = useTemplateRef('importTasksInput')
const taskStore = useTasksStore()

function exportAllTasks() {
  // Будет проблемой если много задач, т.к есть ограничение на буфер обмена
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(getJSONTaskListFromLS())
      .then(() => {
        toast.success('Задачи скопированы в буфер обмена')
      })
      .catch(() => {
        toast.error('Не удалось экспортировать задачи :(')
      })
  }
}

function handleAndAddTasks(taskList) {
  try {
    let newTasks = handleImportTasks(taskList)
    taskStore.addTasks(newTasks)
    toast.success('Задачи добавлены!')
  } catch (error) {
    toast.error(error.message)
  }
}

function onImportTasks() {
  // Работаем только с массивом объектов
  try {
    let parsedInput = JSON.parse(importTasksInput.value.value)
    if (!isArrayOfObjects(parsedInput)) {
      throw new Error()
    }
    handleAndAddTasks(parsedInput)
  } catch (e) {
    toast.error('Неверный формат')
  }
}
</script>

<template>
  <div class="mt-6">
    <button
      class="py-1.5 px-3 grow transition hover:bg-purple-400 bg-gray-800 rounded-sm cursor-pointer font-medium"
      @click="exportAllTasks"
    >
      Экпорт всех задач
    </button>
    <button
      class="ml-2.5 py-1.5 px-3 grow transition hover:bg-purple-400 bg-gray-800 rounded-sm cursor-pointer font-medium"
      @click="onImportTasks"
    >
      Импорт задач
    </button>
    <div class="mt-2.5 p-2.5 border border-gray-400 rounded-sm w-full border-dashed">
      <textarea
        ref="importTasksInput"
        rows="3"
        @input="adjustHeight(importTasksInput)"
        class="block w-full placeholder:text-gray-400 focus:border-none outline-none resize-none"
        placeholder="Введите сюда список задач в формате JSON: [ { }, { } ]"
        style="max-height: 400px"
      ></textarea>
    </div>
  </div>
</template>

<style scoped></style>
