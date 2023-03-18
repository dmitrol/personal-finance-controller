<template>
  <div class="loader-container" v-show="isLoading">
    <div class="loader">
      <div class="loader__blocks" style="--i: 1"></div>
      <div class="loader__blocks" style="--i: 2"></div>
      <div class="loader__blocks" style="--i: 3"></div>
      <div class="loader__blocks" style="--i: 4"></div>
      <div class="loader__blocks" style="--i: 5"></div>
      <div class="loader__blocks" style="--i: 6"></div>
      <div class="loader__blocks" style="--i: 7"></div>
      <div class="loader__blocks" style="--i: 8"></div>
      <div class="loader__blocks" style="--i: 9"></div>
      <div class="loader__blocks" style="--i: 10"></div>
      <div class="loader__blocks" style="--i: 11"></div>
      <div class="loader__blocks" style="--i: 12"></div>
      <div class="loader__blocks" style="--i: 13"></div>
      <div class="loader__blocks" style="--i: 14"></div>
      <div class="loader__blocks" style="--i: 15"></div>
      <div class="loader__blocks" style="--i: 16"></div>
      <div class="loader__blocks" style="--i: 17"></div>
      <div class="loader__blocks" style="--i: 18"></div>
      <div class="loader__blocks" style="--i: 19"></div>
      <div class="loader__blocks" style="--i: 20"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  background: #898989;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  @media (max-width: 480px) {
    position: fixed;
  }
  .loader {
    position: relative;
    width: 100px;
    height: 100px;
    .loader__blocks {
      position: absolute;
      width: 6px;
      height: 15px;
      left: 50%;
      background: #050c05;
      border-radius: 3px;
      transform: rotate(calc(18deg * var(--i)));
      transform-origin: 0 50px;
      animation: animate 1.4s ease-in-out infinite;
      animation-delay: calc(0.07s * var(--i));
    }
  }
  @keyframes animate {
    0%,
    1% {
      background: #2a3029;
      box-shadow: none;
    }
    1% {
      background: var(--va-primary);
      box-shadow: 0 0 5px var(--va-primary), 0 0 15px var(--va-primary),
        0 0 30px var(--va-primary), 0 0 60px var(--va-primary);
    }
    95%,
    100% {
      background: #050c09;
      box-shadow: none;
    }
  }
}
</style>
