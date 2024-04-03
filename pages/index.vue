<template>
  <v-app-bar class="header">
    <v-btn variant="outlined" prepend-icon="add_comment" class="btn_home" @click="changeView('welcome')">首页</v-btn>
    <v-col :span="8">
      <div class='nav-goto'>
        <!-- 导航链接 -->
        <div class='nav-links nav_1' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('idea')">构思</div>
        <div class='nav-links nav_2' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('source')">素材</div>
        <div class='nav-links nav_3' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('description')">文案</div>
        <router-link to="/Page_FrameWorld/Home" target="_blank" class='nav-links nav_4' @mouseover="hoverIn" @mouseout="hoverOut">帧世界</router-link>
      </div>
    </v-col>
  </v-app-bar>
  <v-main>
    <component :is="currentComponent"/>
  </v-main>
</template>

<script setup>
import Welcome from '~/components/Welcome.vue';
import NavIdea from '~/components/Page_Idea/NavIdea.vue';
import NavSource from '~/components/Page_Resource/NavSource.vue';
import NavDescription from '~/components/Page_Description/NavDescription.vue';

definePageMeta({
  middleware: ["auth"], //定义页面的中间件，在进入页面前运行。
  path: '/:id?',        //定义页面的路由路径。/:id? 表示该页面的路由可以有一个可选的 id 参数。
  keepalive: true       //是否保持页面状态，或重新加载页面。
});

const route = useRoute();
const router = useRouter();
const currentComponent = ref('Welcome'); // 默认显示的组件

// 组件别名映射，简化跳转逻辑
const componentAliases = computed(() => ({
  welcome: Welcome,
  idea: NavIdea,
  source: NavSource,
  description: NavDescription,
}));

// 利用watch来监听路由变化
watch(() => route.hash, (newHash) => {
  const view = newHash.replace('#', '');
  if (Object.keys(componentAliases.value).includes(view)) {
    currentComponent.value = componentAliases.value[view];
  }
}, { immediate: true });

// 切换main区域显示的组件
const changeView = (view) => {
  router.push({ path: '/', hash: view });
};

// 使用事件对象改变header标签hover颜色
const hoverIn = (event) => {
  document.querySelectorAll('.nav-links').forEach(el => {
    el.style.color = '#C0C4CC';
  });
  event.target.style.color = '#f89898';
};
const hoverOut = () => {
  document.querySelectorAll('.nav-links').forEach(el => {
    el.style.color = '#303133';
  });
};
</script>

<style scoped>
.btn_home {
  border: none;
  color: #e5989b;
}
.header{
  box-shadow: 0 4px 2px -4px rgba(0,0,0,0.12);
}
.nav-goto {
  align-items: center;
  display: flex;
  padding: 15rem;
  margin-left: 6rem;
}
.nav-links {
  font-size: 20px;
  cursor: pointer;
  font-weight: bolder;
  flex-grow: 1;
  transition: color 0.4s ease; /* 提供颜色变化的平滑过渡效果 */
}
.nav_4 {
  text-decoration: none; /* 移除下划线 */
}
</style>
