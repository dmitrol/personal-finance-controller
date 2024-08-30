<template>
  <div>
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
        <va-button-dropdown
          class="language-dropdown"
          :label="localeSelect.toUpperCase()"
          placement="bottom-end"
          hide-icon
        >
          <div
            class="language-dropdown__item"
            v-for="item in languages"
            :key="item"
            @click="switchLocale(item.toLowerCase())"
          >
            {{ item }}
          </div>
        </va-button-dropdown>
        <va-button-dropdown
          class="profile-dropdown"
          label="label"
          placement="bottom-end"
          hide-icon
        >
          <template #label>
            <va-icon name="account_circle" />
          </template>
          <div class="profile-dropdown__item" @click="showSettingModal = true">
            {{ t('global.profile_setting') }}
          </div>
          <div class="profile-dropdown__item logout" @click="logout">
            {{ t('global.logout') }}
          </div>
        </va-button-dropdown>
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
    <profile-setting-modal
      :show="showSettingModal"
      @ok="showSettingModal = false"
      @cancel="showSettingModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import AppNavigationMenu from '@/components/AppNavigationMenu.vue'
import ProfileSettingModal from '@/components/ProfileSettingModal.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { locale } = useI18n({ useScope: 'global' })

const showMenu = ref(false)
const showSettingModal = ref(false)
const localeSelect = ref(localStorage.getItem('locale') || 'en')
const languages = ['EN', 'RU']

let appTimeInterval = ref(null)
let appTime = ref(resolveTime())

onMounted(() => {
  localeSelect.value = localStorage.getItem('locale') || 'en'
  locale.value = localeSelect.value
  appTimeInterval.value = setInterval(() => {
    appTime.value = resolveTime()
  }, 1000)
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

function switchLocale(value) {
  if (value !== localeSelect.value) {
    store.dispatch('profile/updateLocale', value).then((data) => {
      const result = data?.data?.locale
      if (result) {
        localeSelect.value = result
      }
    })
  }
}

function resolveTime() {
  return moment().locale(localeSelect.value).format('dddd, DD MMMM YYYY h:mm:ss')
}

watch(route, () => {
  showMenu.value = false
})
watch(localeSelect, () => {
  locale.value = localeSelect.value
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
  padding: 9px 24px;
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
  .profile-dropdown {
    .va-dropdown__content-wrapper {
      left: 0;
    }
    &__item {
      cursor: pointer;
      padding: 5px 10px;
    }
    &__item:hover {
      background: var(--aside-menu-item-hover);
    }
    .logout {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .language-dropdown {
    text-transform: uppercase;
    &__item {
      cursor: pointer;
      padding: 5px 10px;
    }
    &__item:hover {
      background: var(--aside-menu-item-hover);
    }
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
