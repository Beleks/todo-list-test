import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export const useSettingsStore = defineStore('settings', () => {
  const { t, locale } = useI18n({ useScope: 'global' })

  const taskPriorities = computed(() => {
    return {
      1: {
        title: t('lowPriority'),
        class: 'stroke-blue-400',
        activeClass: 'text-blue-400',
      },
      2: {
        title: t('middlePriority'),
        class: 'stroke-yellow-400',
        activeClass: 'text-yellow-400',
      },
      3: {
        title: t('highPriority'),
        class: 'stroke-red-400',
        activeClass: 'text-red-400',
      },
    }
  })

  const statusTypes = computed(() => {
    return {
      all: {
        title: t('allTasks'),
        checkQuality() {
          return true
        },
      },
      active: {
        title: t('activeTask'),
        checkQuality(task) {
          return !task.isReady
        },
      },
      completed: {
        title: t('inactiveTask'),
        checkQuality(task) {
          return task.isReady
        },
      },
    }
  })

  const tasksOnPage = ref(3)

  function changeLocale(newValue) {
    locale.value = newValue
  }

  return { taskPriorities, statusTypes, tasksOnPage, locale, changeLocale }
})
