<template>
  <div class="main-container" ref="vantaRef">
    <div class="main-field" @mouseenter="showControls" @mouseleave="delayedHideControls">
      <div class="displayer-up">
        <VideoDisplay />
        <framecomment v-if="showFrameComments && isAtMarker" class="frame-comments" :currentTimestamp="currentTimestamp" :uniqueTimestamps="uniqueTimestamps"/>
      </div>
      <div class="displayer-bottom" ref="controlsRef">
        <ProgressBar :entry="entry" :uniqueTimestamps="uniqueTimestamps" @update-time="setCurrentTime" @toggle-comments="handleToggleComments"/>
      </div>
    </div>
    <div class="comments-section">
      <Comment/>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three"
import FOG from "vanta/src/vanta.fog"
import Comment from "./comment.vue";
import VideoDisplay from "./VideoDisplay.vue";
import ProgressBar from "./ProgressBar.vue";
import Framecomment from "./framecomment.vue";
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const controlsRef = ref(null)
const props = defineProps({
  entry: Object
});

const uniqueTimestamps = ref([]);// 进度条评论标记点
let hideTimeout = null;// 用于延迟隐藏的定时器
const currentTimestamp = ref(0);
const setCurrentTime = (time) => {
  currentTimestamp.value = time;
};

const showFrameComments = ref(true);

const handleToggleComments = (visible) => {
  showFrameComments.value = visible;
};

const isAtMarker = computed(() => {
  return uniqueTimestamps.value.includes(currentTimestamp.value);
});

const showControls = () => {
  clearTimeout(hideTimeout)
  controlsRef.value.style.opacity = '1'
}

const delayedHideControls = () => {
  hideTimeout = setTimeout(hideControls, 500)
}

const hideControls = () => {
  controlsRef.value.style.opacity = '0'
}


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

// Initialization
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
.main-field {
  width: 877px;
  height: 580px;
  backdrop-filter: blur(50px);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin-top: 1rem;
}
.displayer-up {
  position: relative;
  height: 85%;
}
.displayer-bottom {
  height: 15%;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  position: relative;
  padding: 10px;
}
.frame-comments {
  position: absolute; /* 绝对定位，覆盖在视频播放区域上 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* 确保评论显示在视频内容之上 */
  overflow-y: auto; /* 允许滚动 */
  background-color: rgba(0, 0, 0, 0.5); /* 可选：添加半透明背景增强可读性 */
}
.comments-section {
  padding: 2rem;
  margin-top: 20px;
  background-color: #fff; /* 根据需要调整 */
  height: auto;
  margin-left: auto; /* 自动计算左边距 */
  margin-right: auto; /* 自动计算右边距 */
  width: 877px;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
</style>
