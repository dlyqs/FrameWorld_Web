<template>
  <div class="app-container">
    <Header :userinfo="userInfo" :user="user"/>
    <div class="content-container">
      <div class="sidebar">
        <div class="sidebar-content" v-show="drawer" ref="sidebar">
          <component :is="currentSidebarComponent" :entry-id="entryId" />
          <div class="resizer" @mousedown.prevent="startResize"></div>
        </div>
      </div>
      <!-- 侧边栏开关,待改进 -->
      <div class="sidebar-toggle" :class="{ 'hover': hover, 'open': drawer }"
           @click="toggleDrawer" @mouseover="hover = true" @mouseleave="hover = false">
        <div class="line line1"></div>
        <div class="line line2"></div>
      </div>
      <div class="main-content">
        <Main :entry="entryData"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarHome from '~/components/Page_FrameWorld//SidebarHome.vue';
import EntryDetail from '~/components/Page_FrameWorld//EntryDetail.vue';

const route = useRoute();
// 监听路由变化来更新组件
const currentSidebarComponent = computed(() => {
  return route.query.entryId ? EntryDetail : SidebarHome;
});



// 布局设置
definePageMeta({
  layout: 'frameworld'
})

import Main from '~/components/Page_FrameWorld/Main.vue';
import Header from '~/components/Page_FrameWorld/Header.vue';

const sidebar = ref(null)
const resizing = ref(false)
const startWidth = ref(0)
const startX = ref(0)
const sidebarWidth = ref(240)  // 默认侧边栏宽度

watchEffect(() => {
  if (sidebar.value) {
    sidebarWidth.value = sidebar.value.offsetWidth
  }
})
const startResize = event => {
  resizing.value = true
  startX.value = event.clientX
  startWidth.value = sidebar.value.offsetWidth
  event.preventDefault()
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.userSelect = 'none' // 禁止选中文本
}

const resize = event => {
  if (resizing.value) {
    const currentWidth = startWidth.value + event.clientX - startX.value
    sidebar.value.style.width = `${currentWidth}px`
    sidebarWidth.value = currentWidth
  }
}

const stopResize = () => {
  resizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.userSelect = '' // 恢复选中文本
}

/*————————————————————————侧边栏开关与显示————————————————————————*/
const drawer = ref(true);
const hover = ref(false);

const toggleDrawer = () => { drawer.value = !drawer.value; };

/*————————————————————————frameworld全局信息加载————————————————————————*/
const user = useUser()
const entryId = useEntryId() // 假设当前条目ID，后期动态获取
const entryData = ref(null);
const { userInfo, error, fetchUserInfo } = useUserInfo();

const loadData = async () => {
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
};

// 初始挂载时加载数据
onMounted(loadData);

// 监听 entryId 的变化，变化时重新加载数据
watch(entryId, (newId, oldId) => {
  if (newId !== oldId) {
    loadData();
  }
});

</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.content-container {
  display: flex;
  flex: 1;
  margin-top: 60px; /* Header的高度 */
  height: calc(100vh - 60px); /* 减去Header的高度，剩余的视窗高度 */
}

.sidebar {
  width: auto; /* 侧边栏宽度 */
  flex-shrink: 0;
  transition: width 0.3s;
  overflow-y: auto; /* 如果内容超出，允许垂直滚动 */
  overflow-x: hidden;
  position: relative;
  display: flex;

}
.sidebar-content{
  overflow-y: hidden; /* 如果内容超出，允许垂直滚动 */
  overflow-x: hidden;
  width: 240px;
  min-width: 240px;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex-grow: 1;
  overflow-y: auto; /* 允许内容区垂直滚动 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

Header {
  height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.resizer {
  cursor: ew-resize;
  width: 4px;
  height: 100%;
  background-color: inherit; /* 调整为适合的颜色 */
  position: absolute;
  right: 0;
  top: 0;
  transition: background-color 0.3s;
}
.resizer:hover {
  background-color: gray; /* 调整为适合的颜色 */
}
/* 页面滚动条及其轨道、滑块样式 */
::-webkit-scrollbar {
  width: .5rem;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.3);
  --tw-border-opacity: 1;
  border-radius: 9999px;
  border-width: 1px;
}
::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: rgba(128, 128, 128, 0.5);
}

/* 侧边栏控制按钮样式 */
.sidebar-toggle {
  cursor: pointer;
  top:50%;
  width: 25px;
  height: 30px;
  position: relative;
}
.line {
  position: absolute;
  margin-left: 2px;
  width: .25rem;
  height: 49%;
  background-color: rgba(108,117,125) ;
  border-radius: .5rem;
  transition: transform 0.3s, background-color 0.3s;
}
.line1 {
  bottom: 50%;
  height: 49%; /* 第一根线稍微长一点 */
  left: 35%;
  transform: translateX(-50%); /* 水平居中 */
  transform-origin: center bottom;
}
.line2 {
  top: 40%;
  height: 49%; /* 第二根线稍微短一点 */
  left: 35%;
  transform: translateX(-50%) ; /* 水平居中并翻转 */
  transform-origin: center top;
}
.hover .line {
  background-color: #343a40 ;
}
.hover:not(.open) .line1 {
  transform: rotate(-35deg);
  width: .3rem;
}
.hover:not(.open) .line2 {
  transform: rotate(35deg);
  width: .3rem;
}
.hover.open .line1 {
  transform: rotate(35deg);
  width: .3rem;
}
.hover.open .line2 {
  transform: rotate(-35deg);
  width: .3rem;
}
</style>
