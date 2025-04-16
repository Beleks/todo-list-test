<script setup>
const versionApp = __APP_VERSION__
</script>

<template>
  <div>{{ $t('version') }}: {{ versionApp }}</div>
  <!-- Смышлёный, но тестовое без unit-тестов... :( -->
  <!-- [+] TODO: Самому установить дедлайн  -->
  <!-- [+] TODO: Не успеть к дедлайну -->
  <!-- [+] TODO: Не писать тесты, чтобы не срывать дедлайн -->
  <!-- [ ] TODO: Попробовать дописать тесты после того как скинул на проверку -->
  <div>{{ $t('razrabTestovogo') }}: Смышлёный Алексей Кандидатович</div>
</template>

<style></style>
