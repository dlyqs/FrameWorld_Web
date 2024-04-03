<template>
  <v-app>
    <v-app-bar class="header">
      <div class='nav-goto'>
        <!-- 导航链接 -->
        <div class='nav-links nav_1' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('Video')">视频</div>
        <div class='nav-links nav_2' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('Music')">声音</div>
      </div>
    </v-app-bar>

    <!-- 侧边栏开关 -->
    <div class="sidebar-toggle" @click="toggleDrawer" @mouseover="hover = true" @mouseleave="hover = false" :style="toggleButtonStyle">
      <div class="icon-container">
        <svg class="icon fade" width="32" height="32" viewBox="0 0 1024 1024" fill="#666666">
          <path :d="drawerArrow"></path>
        </svg>
      </div>
    </div>

    <!-- 侧边栏主体 -->
    <v-navigation-drawer v-model="drawer" :permanent="drawerPermanent" width="250" class="main-drawer">
      <!-- 用户信息 -->
      <div class="user-card elevation-0">
        <v-card class="user-card-content elevation-0" id="menu-activator">
          <v-row>
            <v-col cols="3">
              <v-avatar size="38px" class="avatar">
                <img src="/headpic.jpg" alt="User's avatar">
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <div class="text-name">lyq</div>
              <div class="text-caption">6dlyqs6@gmail.com</div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- 用户管理 -->
      <v-menu activator="#menu-activator" offset-y absolute nudge-top="10" min-width="inherit" transition="slide-y-transition">
        <v-list class="user-list">
          <v-list-item @click="signOut" class="user-list-item">
            <v-list-item-icon>
              <v-icon>logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="list-item-content">退出</v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-menu>
      <v-divider></v-divider>

      <!-- 设置 -->
      <template v-slot:append>
        <v-expansion-panels style="flex-direction: column" >
          <v-expansion-panel rounded="rounded-pill" style="background-color: rgba(0, 0, 0, 0); border-radius: 0;">
            <v-expansion-panel-title expand-icon="expand_less" collapse-icon="expand_more" class="setting_title">
              <v-icon icon="settings" class="mr-4"></v-icon> {{ "设置" }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="px-1">
                <v-list density="compact">
                </v-list>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-navigation-drawer>

    <v-main class="main">
      <Main/>
    </v-main>
  </v-app>
</template>

<script setup>
import Main from '~/pages/Page_FrameWorld/Main.vue';

definePageMeta({
  layout: 'frameworld'
})

const route = useRoute();
const router = useRouter();
const currentComponent = ref('Main'); // 默认显示的组件

// 组件别名映射，简化跳转逻辑
const componentAliases = computed(() => ({
  Video: Main,
  Music: Main,
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
  router.push({ path: '/Page_FrameWorld/', hash: view });
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

import { useDrawer } from "~/composables/states";
import { useDisplay } from 'vuetify'

/*————————————————————————侧边栏开关与显示————————————————————————*/
const drawer = useDrawer()
const hover = ref(false);
// 确定设备类型
const { mdAndUp } = useDisplay()
// 根据设备类型决定侧边栏是否为永久显示
const drawerPermanent = computed(() => mdAndUp.value)
// 根据drawer和hover状态，计算图标路径
const drawerArrow = computed(() => {
  if (drawer.value && hover.value) return "M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z";
  else if (!drawer.value) return "M613.504 512L274.752 173.248l90.496-90.496L794.496 512l-429.248 429.248-90.496-90.496z";
  else return "M355.53333337 144.6c0 3.8-0.4 7.5-0.9 11.2l0.9 0 0 714-0.9 0c0.5 3.7 0.9 7.4 0.9 11.2 0 43.1-35 78.1-78.1 78.1S199.33333337 924.1 199.33333337 881c0-3.8 0.4-7.5 0.9-11.2L199.33333337 869.8l0-714 0.9 0c-0.5-3.7-0.9-7.4-0.9-11.2 0-43.1 35-78.1 78.1-78.1S355.53333337 101.5 355.53333337 144.6z";
});
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleButtonStyle = computed(() => ({
  left: drawer.value ? 'var(--sidebar-width, 250px)' : '0px',
  top: '50%',
  transform: 'translateY(-50%)',
  position: 'fixed',
  cursor: 'pointer',
  zIndex: 100
}));

/*————————————————————————用户管理操作————————————————————————*/
const user = useUser()
const menu = ref(false)

// 用户登出
const signOut = async () => {
  const { error } = await useFetch('/api/account/logout/', {
    method: 'POST'
  })
  if (!error.value) {
    await logout()
    menu.value = false // Close the menu after logging out
  }
}

</script>

<style scoped>
.header{
  box-shadow: 0 4px 2px -4px rgba(0,0,0,0.12);
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.nav-goto {
  align-items: center;
  display: flex;
  padding-left: 36rem;
}
.nav-links {
  font-size: 20px;
  cursor: pointer;
  font-weight: bolder;
  flex-grow: 1;
  padding: 5rem;
  transition: color 0.4s ease; /* 提供颜色变化的平滑过渡效果 */
}
.main-drawer{
  background-color: rgba(0, 0, 0, .02) ;
  border: none;
  height: 100vh;
}
.main {
  max-height: 100vh; /* 视口高度 */
  overflow-y: auto; /* 超出内容允许滚动 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}
.user-card{
  margin-top: 0.8rem;
  padding: 0 1rem; /* 增加 padding 来增加高度 */
  position: relative; /* 为了使 .user-card-content 在中间 */
}
.user-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem; /* 增加 padding 来增加高度 */
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
  background-color: rgba(0, 0, 0, 0) ;
}
.user-card-content:hover, .v-menu__content--active .user-card-content {
  background-color: rgba(0, 0, 0, .05) !important;
}
.text-name {
  font-family: 'smiley-sans', sans-serif;
  font-weight: bold;
}
.text-caption {
  font-family: 'calibri', sans-serif;
  font-size: 0.8rem;
}
.user-list{
  margin-top: 0.5rem;
}
.user-list-item {
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex
}
.list-item-content{
  margin-left: 1rem;
}
.user-list-item:hover {
  background-color: rgba(0,0,0,0.04);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.avatar{
  margin-left: 4px;
  margin-top: 2px;
}
.avatar img {
  width: 100%;
  height: auto;
}
.avatar:hover {
  transform: scale(1.2);
  border: 2px solid transparent;
  background-image: linear-gradient(white, white), radial-gradient(circle at top left, #ffcad4, #f4acb7);
  background-origin: border-box;
  background-clip: content-box, border-box;
  transition: 0.4s;
}
.v-divider {
  margin-top: 0.8rem; /* 增加上下间距并设置左右边距 */
  margin-left: 12px;
  margin-right: 12px;
  height: 10px;
  background-color: rgba(0,0,0,0.12); /* 分割线颜色，根据需要调整 */
}
.setting_list_item {
  border-radius: 4px;
  margin-right: 0.3rem;
}
.icon-container {
  position: relative;
  width: 32px; /* 根据实际图标大小调整 */
  height: 32px; /* 根据实际图标大小调整 */
}
.fade {
  opacity: 1 !important;
}
</style>
