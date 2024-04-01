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
import NavLogo from './nav-logo.vue'
import NavSearch from './nav-search.vue'
import NavFavorite from './nav-favorite.vue'
import NavFoot from './nav-foot.vue'

/*————————————————————————对话加载及路由跳转————————————————————————*/
const router = useRouter();
async function fetchSourcePage(id) {
  const { data, error } = await useAuthFetch(`/api/chat/conversations/${id}`);
  if (!error.value && data.value.source_page) { return data.value.source_page; }
  return null;
}

onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.id && to.params.id !== from.params.id) {
    const sourcePage = await fetchSourcePage(to.params.id);
    if (sourcePage) {
      await router.replace({path: '/', hash: `${sourcePage}`});
      await router.replace({ path:`/${to.params.id}`});
    }
  }
  next();
});
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
