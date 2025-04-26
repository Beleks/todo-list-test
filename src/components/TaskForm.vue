<script setup>
// TODO: {...props.task} - попробовать пересмотреть подход

import { onMounted, ref, useTemplateRef } from 'vue'
import { useSettingsStore } from '@/stores/settings.js'
import { initEmptyTask } from '@/helpers/helper.js'
import IconPriority from '@/components/icons/IconPriority.vue'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  task: {
    type: Object,
    default() {
      return initEmptyTask()
    },
  },
})

const emit = defineEmits(['createTask', 'cancelChange', 'editTask'])

const settingsStore = useSettingsStore()

const taskContentInput = useTemplateRef('taskContentInput')
const newTask = ref({ ...props.task }) // Учитываем что объект не глубокий

function choosePriority(priorityId) {
  newTask.value.priorityId = priorityId
}

function cancelChange() {
  emit('cancelChange')
  newTask.value = { ...props.task }
}

function confirmChange(task) {
  // TODO: Убрать лишние пробелы, переносы строк?
  if (!task.content.length) {
    // Проверка нужна если вызывается через alt+enter
    return
  }
  if (props.isEdit) {
    emit('editTask', task)
  } else {
    emit('createTask', task)
    newTask.value = { ...props.task }
  }
}

function handleKeyupCode(event) {
  if (Object.keys(settingsStore.taskPriorities).includes(event.key)) {
    choosePriority(event.key)
  }
}

onMounted(() => {
  taskContentInput.value.focus()
})
</script>

<template>
  <div class="p-2.5 border border-gray-400 rounded-sm w-full border-dashed">
    <!-- Корректно ли вешать adjustHeight на событие input? -->
    <input
      ref="taskContentInput"
      class="block w-full placeholder:text-gray-400 focus:border-none outline-none resize-none"
      :placeholder="$t('createTaskPlaceholder')"
      @keyup.alt.enter="confirmChange(newTask)"
      @keyup.alt="handleKeyupCode"
      v-model="newTask.content"
      type="text"
    />
    <!--    <textarea></textarea>-->
    <div class="flex flex-col gap-1.5 items-stretch justify-between leading-4 mt-2.5 lg:flex-row">
      <div class="flex items-center w-full lg:w-fit gap-1 sm:gap-2.5">
        <div class="hidden lg:block">{{ $t('priority') }}:</div>
        <div
          v-for="(priority, key) in settingsStore.taskPriorities"
          @click="choosePriority(key)"
          :class="[
            newTask.priorityId === key ? priority.activeClass : 'border-gray-400 bg-gray-900',
          ]"
          class="flex grow justify-center items-center gap-1 sm:gap-1.5 cursor-pointer text-sm border p-1 px-1 sm:px-2.5 rounded-sm"
        >
          <IconPriority
            :class="[newTask.priorityId === key ? priority.class : 'stroke-gray-400']"
            class="stroke-1"
            :size="20"
          />
          {{ priority.title }}
        </div>
      </div>
      <div class="flex gap-1 sm:gap-2.5 items-center font-medium w-full lg:w-fit">
        <button
          v-if="isEdit"
          class="p-2.5 grow bg-gray-800 rounded-sm cursor-pointer"
          @click="cancelChange"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="p-2.5 grow bg-purple-400 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!newTask.content"
          @click="confirmChange(newTask)"
        >
          {{ isEdit ? $t('saveChange') : $t('addTask') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
