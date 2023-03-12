<template>
  <div>
    <div>Main page</div>
    <div>profileId: {{ profile.id }}</div>
    <div @click="logout">Logout</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const profile = computed(() => {
  return store.state.profile.profile
})

async function logout() {
  router.push({ name: 'login' })
  await store.dispatch('auth/logout')
}
</script>
