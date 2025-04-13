<script setup>
import { nextTick, ref, useTemplateRef } from 'vue'
import { useSettingsStore } from '@/stores/settings.js'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  task: {
    type: Object,
  },
})

const emit = defineEmits(['createTask', 'cancelChange'])

const settingsStore = useSettingsStore()

const taskContentArea = useTemplateRef('taskContentArea')
const newTask = ref(initEmptyTask())

function choosePriority(priorityId) {
  newTask.value.priorityId = priorityId
}

function adjustHeight(textareaRef) {
  textareaRef.style.height = 'auto'
  textareaRef.style.height = `${textareaRef.scrollHeight}px`
}

function cancelChange() {
  emit('cancelChange')
  newTask.value = initEmptyTask()
}

async function confirmChange(task) {
  // TODO: Убрать лишние пробелы, переносы строк?
  // if (!task.content.length) {
  //   return
  // }
  if (props.isEdit) {
    emit('editTask', task)
  } else {
    emit('createTask', task)
    newTask.value = initEmptyTask()
  }

  await nextTick()
  adjustHeight(taskContentArea.value)
}

function initEmptyTask() {
  // priorityId -> priorityKey?
  // Or set from props?
  return {
    id: null,
    content: '',
    priorityId: '1',
    isReady: false,
  }
}
</script>

<template>
  <div class="p-2.5 border border-gray-400 rounded-sm w-full border-dashed">
    <!-- Корректно ли вешать adjustHeight на событие input? -->

    <!-- @focus="onFocus"   -->
    <textarea
      ref="taskContentArea"
      class="block w-full placeholder:text-gray-400 focus:border-none outline-none resize-none"
      placeholder="Введите название задачи..."
      rows="1"
      @input="adjustHeight(taskContentArea)"
      @keyup.alt.enter="confirmChange(newTask)"
      v-model="newTask.content"
    ></textarea>
    <div class="flex items-center justify-between leading-4 mt-2.5">
      <div class="flex gap-2.5">
        Приоритет:
        <div
          v-for="(priority, key) in settingsStore.taskPriorities"
          @click="choosePriority(key)"
          :class="[newTask.priorityId === key ? priority.activeClass : '']"
          class="cursor-pointer"
        >
          {{ priority.title }}
        </div>
      </div>
      <div class="flex gap-2.5 items-center font-medium">
        <!-- один метод confirmChange? -->
        <button class="p-2.5 bg-gray-800 rounded-sm cursor-pointer" @click="cancelChange">
          Отмена
        </button>
        <button
          class="p-2.5 bg-purple-400 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!newTask.content"
          @click="confirmChange(newTask)"
        >
          {{ isEdit ? 'Сохранить изменения' : 'Добавить задачу' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
