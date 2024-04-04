<template>
  <div class="vue-app">
    <header class="app-header">
      <div class="logo-wrapper">
        <nav-logo />
      </div>
      <div>
        <nav-search />
      </div>
    </header>
    <div class="favorites-wrapper">
      <nav-favorite />
    </div>
    <nav-foot />
  </div>
</template>

<script setup>
import NavLogo from '~/components/Page_Resource/nav-logo.vue'
import NavSearch from '~/components/Page_Resource/nav-search.vue'
import NavFavorite from '~/components/Page_Resource/nav-favorite.vue'
import NavFoot from '~/components/Page_Resource/nav-foot.vue'

</script>

<style scoped>
.vue-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-header {
  background-color: white;
}
.logo-wrapper{
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}
.favorites-wrapper {
  flex-grow: 1;
  background-color: #eaf4f4;
  display: flex;
  justify-content: center;
  padding: 2rem;
  border-radius:20px 20px 0 0; /* 顶部圆角 */
  margin-top: -2rem; /* 移除顶部间隙 */
  overflow: hidden; /* 确保子元素不会超出边界 */
}
</style>
