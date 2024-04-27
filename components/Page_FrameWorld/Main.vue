<template>
  <div class="main-container" ref="vantaRef">
    <!-- 播放器区域 -->
    <div class="player-window">
      <VideoDisplay :currentTime="currentTime"/>
      <transition name="fade">
        <FrameComment class="frame-comments" v-if="showFrameComments && isAtMarker"
                      :currentTimestamp="currentTime" :uniqueTimestamps="uniqueTimestamps"/>
      </transition>
    </div>
    <!-- 帧评论区域 -->
    <div class="player-controls">
      <ProgressBar :entry="entry" :uniqueTimestamps="uniqueTimestamps" @update-time="handleCurrentTime"
                   @toggle-comments="handleToggleComments" @new-comment="handleNewComment"/>
    </div>
    <!-- 总评论区域 -->
    <div class="comments-section">
      <GlobalComment/>
    </div>
    <Footer/>
  </div>
</template>

<script setup>
import GlobalComment from "./GlobalComment.vue";
import VideoDisplay from "./VideoDisplay.vue";
import ProgressBar from "./ProgressBar.vue";
import FrameComment from "./FrameComment.vue";
import Footer from "./Footer.vue";

const props = defineProps({
  entry: Object
});
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const currentTime = ref(0);
const uniqueTimestamps = ref([]); // 进度条评论标记点
const showFrameComments = ref(true); // 控制帧评论显示与隐藏
const user = useUser();

// 处理进度条传来的当前时间
const handleCurrentTime = (time) => {
  currentTime.value = time;
};

// 新增评论时在进度条上添加标记
const handleNewComment = (time) => {
  uniqueTimestamps.value.push(time);
};

// 控制帧评论显示与隐藏
const handleToggleComments = (visible) => {
  showFrameComments.value = visible;
};

// 判断当前时间是否在评论标记点上
const isAtMarker = computed(() => {
  return uniqueTimestamps.value.includes(currentTime.value);
});

// 加载当前条目帧评论, 获取标记点列表
onMounted(async () => {
  try {
    const response = await fetch(`/api/frameworld/frame_comments/${entryId.value}/comments_for_entry`);
    if (response.ok) {
      const data = await response.json();
      const timestamps = new Set(data.map(comment => Math.floor(comment.timestamp)));
      uniqueTimestamps.value = [...timestamps];
    } else {
      console.error('Failed to fetch comments:', response.status);
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
});

// Vanta背景效果
import * as THREE from "three"
import FOG from "vanta/src/vanta.fog"
const vantaRef = ref(null)
let vantaEffect = null

onMounted(() => {
  vantaEffect = FOG({
    el: vantaRef.value,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    highlightColor: 0xeec0d4,
    midtoneColor: 0xe1a5a5,
    lowlightColor: 0xc5b0bc,
    baseColor: 0xfdfafc,
    blurFactor: 0.5,
    speed: 1.20,
    zoom: 1.20
  });
})

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
</script>

<style scoped>
.main-container {
  z-index: 0;
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 设置为垂直布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: auto;
}
.player-window {
  width: 70vw;
  height: 68vh;
  backdrop-filter: blur(50px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  flex-direction: column;
  display: flex;
  margin-top: 1rem;
  border-radius: 20px 20px 0 0;
}
.player-controls {
  width: 70vw;
  height: auto;
  background-color: rgba(255, 255, 255, 0.8);
  position: relative;
  padding: 12px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.frame-comments {
  position: absolute; /* 绝对定位，覆盖在视频播放区域上 */
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* 确保评论显示在视频内容之上 */
  overflow-y: auto; /* 允许滚动 */
  background-color: rgba(0, 0, 0, 0.5); /* 可选：添加半透明背景增强可读性 */
  margin: 0 auto; /* 水平居中 */
  padding: 0;
}
.comments-section {
  width: 70vw;
  padding: 2rem;
  margin-top: 20px;
  background-color: #fff; /* 根据需要调整 */
  height: auto;
  margin-left: auto; /* 自动计算左边距 */
  margin-right: auto; /* 自动计算右边距 */
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
