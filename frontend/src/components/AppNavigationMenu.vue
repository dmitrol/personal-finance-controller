<template>
  <aside class="aside-menu">
    <va-scroll-container
      style="max-height: var(--main-content-height)"
      color="primary"
      vertical
    >
      <router-link
        class="menu-item"
        :class="activeClass('statistic')"
        :to="{ name: 'statistic' }"
      >
        {{ t('global.menu.statistic') }}
      </router-link>
      <router-link
        class="menu-item"
        :class="activeClass('records')"
        :to="{ name: 'records' }"
      >
        {{ t('global.menu.records') }}
      </router-link>
      <router-link
        class="menu-item"
        :class="activeClass('category')"
        :to="{ name: 'category' }"
      >
        {{ t('global.menu.categories') }}
      </router-link>
      <router-link
        class="menu-item"
        :class="activeClass('bills')"
        :to="{ name: 'bills' }"
      >
        {{ t('global.menu.bills') }}
      </router-link>
      <router-link
        class="menu-item"
        :class="activeClass('currency')"
        :to="{ name: 'currency' }"
      >
        {{ t('global.menu.currency') }}
      </router-link>
    </va-scroll-container>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const activeItem = ref('statistic')

onMounted(() => {
  if (route.name === 'main') {
    router.push({ name: 'statistic' })
  } else if (route.name !== 'statistic') {
    activeItem.value = route.name
  }
})

function activeClass(name) {
  if (activeItem.value === name) {
    return 'menu-item-active'
  }
  return ''
}

watch(route, () => {
  if (route.name === 'main') {
    router.push({ name: 'statistic' })
  }
  activeItem.value = route.name
})
</script>

<style lang="scss" scoped>
.aside-menu {
  background: var(--aside-menu-bg);
  min-height: var(--main-content-height);
}
.menu-item {
  display: block;
  min-width: 220px;
  padding: 16px 24px;
  font-size: 16px;
  line-height: 20px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    background: var(--aside-menu-item-hover);
  }
  &.menu-item-active {
    background: var(--aside-menu-item-active);
  }
}
</style>
