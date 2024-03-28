<template>
  <div class="vue-app">
    <header class="app-header">
      <div class="logo-wrapper">
        <!-- Logo 组件 -->
        <nav-logo />
      </div>
      <div>
        <!-- Search 组件 -->
        <nav-search />
      </div>
    </header>
    <div class="favorites-wrapper">
      <!-- Favorites 组件 -->
      <nav-favorite />
    </div>
    <!-- Footer 组件 -->
    <nav-foot />
  </div>
</template>

<script setup>
import NavLogo from './nav-logo.vue'
import NavSearch from './nav-search.vue'
import NavFavorite from './nav-favorite.vue'
import NavFoot from './nav-foot.vue'
</script>

<style>
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
