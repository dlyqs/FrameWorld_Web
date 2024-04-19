<template>
  <div class="main-container" ref="vantaRef">
    <div class="main-field" @mouseenter="showControls" @mouseleave="delayedHideControls">
      <div class="displayer-up">
        <VideoDisplay />
      </div>
      <div class="displayer-bottom" ref="controlsRef">
        <ProgressBar :entry="entry" />
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

const controlsRef = ref(null)
const props = defineProps({
  entry: Object
});

let hideTimeout = null;// 用于延迟隐藏的定时器

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
  height: 85%;
}
.displayer-bottom {
  height: 15%;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  position: relative;
  padding: 10px;
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
