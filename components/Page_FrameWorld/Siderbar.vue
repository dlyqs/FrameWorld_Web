<template>
  <!-- 侧边栏开关 -->
  <div class="sidebar-toggle" :class="{ 'hover': hover, 'open': drawer }" :style="toggleButtonStyle"
       @click="toggleDrawer" @mouseover="hover = true" @mouseleave="hover = false">
    <div class="sidebar-toggle-icon">
      <div class="line line1"></div>
      <div class="line line2"></div>
    </div>
  </div>

  <!-- 侧边栏主体 -->
  <v-navigation-drawer class="entry-drawer" v-model="drawer" :permanent="drawerPermanent" width="240">
    <div class="entry-info" v-if="entry">
      <img :src="entry.cover_url" alt="Cover image" class="entry-cover">
      <div class="entry-title">{{ entry.title }}</div>
      <div class="entry-detail">{{ entry.x_frame_size }} x {{ entry.y_frame_size }}</div>
      <div class="entry-detail">{{ entry.type }} / {{ entry.version }}</div>
      <div class="entry-detail">{{ formattedTime }}</div>
      <div class="link-container">
        <a :href="entry.douban_url" target="_blank" class="entry-link">
          <v-icon base class="link-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M1023.979 862.827A161.152 161.152 0 0 1 862.805 1024H161.173A161.152 161.152 0 0 1 0 862.827V161.195A161.195 161.195 0 0 1 161.173 0.02h701.632a161.195 161.195 0 0 1 161.174 161.174v701.632z" fill="#05B711" p-id="4274"></path><path d="M218.56 208.064h586.816v66.09H218.56z m535.83 393.493v-258.41h-484.8v258.41h484.8zM339.882 409.173H684.8v126.358H339.883V409.173z m309.61 341.334c21.099-32.299 41.003-69.739 59.435-112.256l-70.507-25.707c-18.346 50.368-39.701 96.427-64 137.941H451.712c-20.373-53.802-43.328-99.818-69.077-137.941l-64.854 25.707c26.752 40.128 48.32 77.482 64.854 112.256H201.94v65.386h620.054v-65.386H649.493z" fill="#FFFFFF" p-id="4275"></path></svg>
          </v-icon>豆瓣
        </a>
        <a :href="entry.imdb_url" target="_blank" class="entry-link">
          <v-icon base class="link-icon">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M610.56 409.088v0.224c-3.296-2.048-9.696-2.976-17.92-2.976v205.44c11.52 0 18.784-2.56 21.344-7.04 2.656-4.448 4.064-17.28 4.064-37.76v-122.272c0-14.08-0.16-23.04-1.408-26.88a12.384 12.384 0 0 0-5.984-8.704zM956.416 0H69.12A73.696 73.696 0 0 0 0 68.096V954.88c2.56 37.28 30.368 65.792 66.336 68.992 0.64 0.128 1.28 0.128 1.92 0.128h889.376a73.664 73.664 0 0 0 66.336-72.96V72.96A73.568 73.568 0 0 0 956.384 0zM204.448 666.72h-81.28v-314.272h81.28v314.272z m279.04-0.096h-70.912v-212.064L384 666.56h-50.688l-29.792-207.36-0.288 207.36H232.096v-314.144h105.312a2736 2736 0 0 1 9.824 67.168l11.52 79.776 18.848-146.944h105.952v314.208z m212.352-93.024c0 27.936-1.888 46.688-4.448 56.32-2.656 9.376-7.264 17.056-13.92 22.176-6.4 5.536-14.496 9.312-24.32 11.36-9.504 1.92-24.32 3.2-43.52 3.2l-0.16-0.096h-98.336v-314.144h60.832c39.008 0 61.856 2.016 75.52 5.472 13.856 3.84 24.544 9.6 31.776 17.92 7.04 7.68 11.648 17.248 13.344 27.52 2.144 10.016 3.232 30.08 3.232 59.808v110.432z m210.944 20.288c0 19.2-1.92 32.608-3.84 42.24-2.56 9.568-8.32 17.248-17.28 24.224-9.632 7.072-20.48 10.24-33.28 10.24-9.376 0-21.344-2.56-29.024-5.792a68 68 0 0 1-21.984-18.208l-4.96 20.064h-73.248v-314.208l-0.864-0.128h76.8v102.4c6.4-7.456 13.44-13.216 21.76-17.056 8.352-3.552 19.872-5.408 29.44-5.408 9.632-0.128 19.2 1.536 28.16 4.896 7.264 2.976 13.664 7.904 18.592 14.08 3.84 5.344 6.4 11.52 7.68 17.92 1.28 5.888 1.888 18.336 1.888 37.12v87.648zM814.08 478.08c-5.12 0-8.288 1.696-9.6 5.12-1.28 3.424-2.56 12.384-2.56 26.624v83.04c0 13.824 1.28 22.752 2.56 26.592a9.92 9.92 0 0 0 9.632 5.728c5.12 0 11.616-2.016 12.8-5.984 1.28-4.128 1.952-13.664 1.952-28.768l1.28-0.096v-80.64c0-12.928-0.64-21.664-2.56-25.728-1.888-4.256-8.32-5.984-13.44-5.984z" fill="#E6B91E" p-id="5285"></path></svg>
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

</template>

<script setup>


/*————————————————————————侧边栏开关与显示————————————————————————*/
import { useDisplay } from 'vuetify'
const drawer = useDrawer()
const hover = ref(false);
const { mdAndUp } = useDisplay()  // 确定设备类型
const drawerPermanent = computed(() => mdAndUp.value) // 根据设备类型决定侧边栏是否为永久显示

const toggleDrawer = () => { drawer.value = !drawer.value; };
const toggleButtonStyle = computed(() => ({ left: drawer.value ? '240px' : '0px', }));

/*————————————————————————条目信息加载————————————————————————*/
const entryId = useEntryId(); // 假设当前条目ID，后期动态获取
const entry = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(`/api/frameworld/entries/${entryId.value}/`);
    if (response.ok) {
      const data = await response.json();
      entry.value = data;
    } else {
      console.error('Failed to fetch entry data, Status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching entry data:', error);
  }
});

const formattedTime = computed(() => {
  const seconds = entry.value.length % 60
  const minutes = Math.floor(entry.value.length / 60) % 60
  const hours = Math.floor(entry.value.length / 3600)
  return `片长：${hours} h ${minutes} m ${seconds} s`
})
</script>

<style scoped>
.entry-drawer{
  background-color: rgba(0, 0, 0, .02) ;
  border: none;
  height: 100vh;
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

/* 侧边栏控制按钮样式 */
.sidebar-toggle {
  position: fixed;
  top: 52%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 100;
}
.sidebar-toggle-icon {
  width: 30px;
  height: 30px;
  position: relative;
}
.line {
  position: absolute;
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

