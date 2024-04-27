<template>
  <v-app>
    <Header :userinfo="userInfo" :user="user"/>
    <Siderbar :entry="entryData"/>
    <v-main class="main">
      <Main :entry="entryData"/>
    </v-main>
  </v-app>
</template>

<script setup>
// 布局设置
definePageMeta({
  layout: 'frameworld'
})

import Main from '~/components/Page_FrameWorld/Main.vue';
import Siderbar from '~/components/Page_FrameWorld/Siderbar.vue';
import Header from '~/components/Page_FrameWorld/Header.vue';

/*————————————————————————frameworld全局信息加载————————————————————————*/
const user = useUser()
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
</script>

<style scoped>
.main {
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
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
</style>
