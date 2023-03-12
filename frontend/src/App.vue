<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    document.querySelector('html').setAttribute('data-theme', 'default')
  },
}
</script>

<style lang="scss"></style>
