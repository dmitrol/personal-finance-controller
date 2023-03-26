<template>
  <div class="header-content">
    <div class="fc-flex-right">
      <div class="sidebar-button" @click="showMenu = !showMenu">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="logo">
        <router-link :to="{ name: 'main' }">Finance-Controller </router-link>
      </div>
      <div class="header-time">{{ appTime }}</div>
    </div>
    <div class="fc-flex-left">
      <div class="logout" @click="logout">{{ t('global.logout') }}</div>
    </div>
    <va-sidebar
      class="modile-aside"
      v-model="showMenu"
      position="left"
      style="position: absolute"
    >
      <app-navigation-menu />
    </va-sidebar>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import applicationTime from '@/service/application-time.js'
import AppNavigationMenu from '@/components/AppNavigationMenu.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const showMenu = ref(false)

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

watch(route, () => {
  showMenu.value = false
})
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
  .sidebar-button {
    display: none;
    width: 20px;
    height: 20px;
    align-items: center;
    margin-right: 8px;
    cursor: pointer;
    div {
      width: 20px;
      height: 2px;
      border-radius: 1px;
      background: var(--text-invert);
    }
    @media screen and (max-width: 720px) {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
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
    @media screen and (max-width: 540px) {
      display: none;
    }
  }
  .logout {
    text-decoration: underline;
    cursor: pointer;
  }
}
.modile-aside {
  display: none;
  top: 58px;
  z-index: 50;
  @media screen and (max-width: 720px) {
    display: block;
  }
}
</style>
