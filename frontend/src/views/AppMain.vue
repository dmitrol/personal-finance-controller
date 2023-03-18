<template>
  <div>
    <div class="header-wrapper">
      <div class="container">
        <app-header></app-header>
      </div>
    </div>
    <div class="application-main-wrapper">
      <div class="container">
        <div class="application-main">
          <app-navigation-menu />
          <div class="general-content">
            <va-scroll-container
              style="max-height: var(--main-content-height)"
              color="primary"
              vertical
            >
              <app-loader :isLoading="loader" />
              <router-view />
            </va-scroll-container>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppNavigationMenu from '@/components/AppNavigationMenu.vue'
import AppLoader from '@/components/AppLoader.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const loader = computed(() => {
  return store.state.global.loader
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  // max-width: 1260px;
  margin: 0 auto;
}
.application-main {
  display: flex;
  .general-content {
    width: 100%;
    min-height: var(--main-content-height);
    position: relative;
  }
}
</style>
