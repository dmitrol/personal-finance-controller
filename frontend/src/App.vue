<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })

onMounted(() => {
  locale.value = localStorage.getItem('locale') || 'en'
  document.querySelector('html').setAttribute('data-theme', 'default')
})

</script>

<style lang="scss"></style>
