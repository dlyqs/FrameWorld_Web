<template>
  <v-app>
    <v-app-bar class="header">
      <!-- 用户信息 -->
      <div class="user-card elevation-0">
        <v-card class="user-card-content elevation-0" id="menu-activator">
          <v-row>
            <v-col>
              <v-avatar size="34px" class="avatar">
                <img :src="userInfo?.avatar_url" alt="User's avatar">
              </v-avatar>
            </v-col>
            <v-col>
              <div class="text-name">{{ user?.username }}</div>
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
      <div class="entry-info" v-if="entryData">
        <img :src="entryData.cover_url" alt="Cover image" class="entry-cover">
        <div class="entry-title">{{ entryData.title }}</div>
        <div class="entry-detail">{{ entryData.x_frame_size }} x {{ entryData.y_frame_size }}</div>
        <div class="entry-detail">{{ entryData.type }} / {{ entryData.version }}</div>
        <div class="entry-detail">{{ formattedTime }}</div>
        <div class="link-container">
          <a :href="entryData.douban_url" target="_blank" class="entry-link">
            <v-icon base class="link-icon">
              <svg t="1713271228009" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4273" width="32" height="32"><path d="M1023.979 862.827A161.152 161.152 0 0 1 862.805 1024H161.173A161.152 161.152 0 0 1 0 862.827V161.195A161.195 161.195 0 0 1 161.173 0.02h701.632a161.195 161.195 0 0 1 161.174 161.174v701.632z" fill="#05B711" p-id="4274"></path><path d="M218.56 208.064h586.816v66.09H218.56z m535.83 393.493v-258.41h-484.8v258.41h484.8zM339.882 409.173H684.8v126.358H339.883V409.173z m309.61 341.334c21.099-32.299 41.003-69.739 59.435-112.256l-70.507-25.707c-18.346 50.368-39.701 96.427-64 137.941H451.712c-20.373-53.802-43.328-99.818-69.077-137.941l-64.854 25.707c26.752 40.128 48.32 77.482 64.854 112.256H201.94v65.386h620.054v-65.386H649.493z" fill="#FFFFFF" p-id="4275"></path></svg>
            </v-icon>豆瓣
          </a>
          <a :href="entryData.imdb_url" target="_blank" class="entry-link">
            <v-icon base class="link-icon">
              <svg t="1713271291421" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5284" width="32" height="32"><path d="M610.56 409.088v0.224c-3.296-2.048-9.696-2.976-17.92-2.976v205.44c11.52 0 18.784-2.56 21.344-7.04 2.656-4.448 4.064-17.28 4.064-37.76v-122.272c0-14.08-0.16-23.04-1.408-26.88a12.384 12.384 0 0 0-5.984-8.704zM956.416 0H69.12A73.696 73.696 0 0 0 0 68.096V954.88c2.56 37.28 30.368 65.792 66.336 68.992 0.64 0.128 1.28 0.128 1.92 0.128h889.376a73.664 73.664 0 0 0 66.336-72.96V72.96A73.568 73.568 0 0 0 956.384 0zM204.448 666.72h-81.28v-314.272h81.28v314.272z m279.04-0.096h-70.912v-212.064L384 666.56h-50.688l-29.792-207.36-0.288 207.36H232.096v-314.144h105.312a2736 2736 0 0 1 9.824 67.168l11.52 79.776 18.848-146.944h105.952v314.208z m212.352-93.024c0 27.936-1.888 46.688-4.448 56.32-2.656 9.376-7.264 17.056-13.92 22.176-6.4 5.536-14.496 9.312-24.32 11.36-9.504 1.92-24.32 3.2-43.52 3.2l-0.16-0.096h-98.336v-314.144h60.832c39.008 0 61.856 2.016 75.52 5.472 13.856 3.84 24.544 9.6 31.776 17.92 7.04 7.68 11.648 17.248 13.344 27.52 2.144 10.016 3.232 30.08 3.232 59.808v110.432z m210.944 20.288c0 19.2-1.92 32.608-3.84 42.24-2.56 9.568-8.32 17.248-17.28 24.224-9.632 7.072-20.48 10.24-33.28 10.24-9.376 0-21.344-2.56-29.024-5.792a68 68 0 0 1-21.984-18.208l-4.96 20.064h-73.248v-314.208l-0.864-0.128h76.8v102.4c6.4-7.456 13.44-13.216 21.76-17.056 8.352-3.552 19.872-5.408 29.44-5.408 9.632-0.128 19.2 1.536 28.16 4.896 7.264 2.976 13.664 7.904 18.592 14.08 3.84 5.344 6.4 11.52 7.68 17.92 1.28 5.888 1.888 18.336 1.888 37.12v87.648zM814.08 478.08c-5.12 0-8.288 1.696-9.6 5.12-1.28 3.424-2.56 12.384-2.56 26.624v83.04c0 13.824 1.28 22.752 2.56 26.592a9.92 9.92 0 0 0 9.632 5.728c5.12 0 11.616-2.016 12.8-5.984 1.28-4.128 1.952-13.664 1.952-28.768l1.28-0.096v-80.64c0-12.928-0.64-21.664-2.56-25.728-1.888-4.256-8.32-5.984-13.44-5.984z" fill="#E6B91E" p-id="5285"></path></svg>
            </v-icon>IMDB
          </a>
        </div>
      </div>


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
      <Main :entry="entryData"/>
    </v-main>
  </v-app>
</template>

<script setup>
import Main from '~/components/Page_FrameWorld/Main.vue';


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

/*————————————————————————条目信息加载————————————————————————*/
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const entryData = ref(null);
const { userInfo, error, fetchUserInfo } = useUserInfo();

onMounted(async () => {
  try {
    const response = await fetch(`/api/frameworld/entries/${entryId.value}/`);
    if (response.ok) {
      const data = await response.json();
      entryData.value = data;
    } else {
      console.error('Failed to fetch entry data, Status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching entry data:', error);
  }
  await fetchUserInfo(user.value.id);
});

const formattedTime = computed(() => {
  const seconds = entryData.value.length % 60
  const minutes = Math.floor(entryData.value.length / 60) % 60
  const hours = Math.floor(entryData.value.length / 3600)
  return `片长：${hours} h ${minutes} m ${seconds} s`
})
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
  padding-left: 32rem;
}
.nav-links {
  font-size: 20px;
  cursor: pointer;
  font-weight: bolder;
  flex-grow: 1;
  padding: 3rem;
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
  margin-left: -0.8rem;
  margin-top: 0.5rem;
  font-size: 1.2rem;
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
.entry-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.entry-cover {
  width: 136px;
  height: 200px;
  display: flex;
  margin-right: 0.75rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.entry-cover:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.entry-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-family: smiley-sans, sans-serif;
}

.link-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.entry-link {
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
}

.link-icon {
  margin-right: 8px;
}

.entry-detail{
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1rem;
  color: #666;
}
/* 针对所有滚动条 */
::-webkit-scrollbar {
  width: .5rem;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.3);
  --tw-border-opacity: 1;
  border-radius: 9999px;
  border-width: 1px;
  transition: background-color 0.3s ease;
  height: 40px; /* 固定高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: rgba(128, 128, 128, 0.6); /* 鼠标悬浮或拖动时不透明 */
}
</style>
