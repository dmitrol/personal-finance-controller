<template>
  <div class="header-content">
    <div class="fc-flex-right">
      <div class="logo">
        <router-link :to="{ name: 'main' }">Finance-Controller </router-link>
      </div>
      <div class="header-time">{{ appTime }}</div>
    </div>
    <div class="fc-flex-left">
      <div class="logout" @click="logout">{{ t('global.logout') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import applicationTime from '@/service/application-time.js'

const store = useStore()
const router = useRouter()
const { t } = useI18n()

let appTimeInterval = ref(null)
let appTime = ref(applicationTime.getCurrentTime())

onMounted(() => {
  appTimeInterval.value = setInterval(() => {
    appTime.value = applicationTime.getCurrentTime()
  }, 10000)
})

onBeforeUnmount(() => {
  if (appTimeInterval.value !== null) {
    clearInterval(appTimeInterval.value)
  }
})

async function logout() {
  router.push({ name: 'login' })
  await store.dispatch('auth/logout')
}
</script>

<style lang="scss" scoped>
.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--header-background);
  color: var(--text-invert);
  padding: 16px 24px;
  .logo {
    font-size: 22px;
    font-weight: 600;
    line-height: 26px;
    a {
      color: var(--text-invert);
    }
  }
  .header-time {
    margin-left: 24px;
    font-size: 16px;
    line-height: 26px;
  }
  .logout {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
