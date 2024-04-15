<template>
  <div class="main-container" ref="vantaRef">
    <div class="main-field" @mouseenter="showControls" @mouseleave="delayedHideControls">
      <div class="displayer-up">
        <!-- 假设的视频内容区域 -->
        <div class="video-placeholder">
          <!-- 视频内容 -->
        </div>
      </div>
      <div class="displayer-bottom" ref="controlsRef">
        <v-slider class="displayer-slider" v-model="progress" :class="{'show-thumb': showThumbFlag}" @mouseenter="showThumb" @mouseleave="hideThumb"></v-slider>
        <!-- 控制按钮行 -->
        <div class="controls-row">
          <div class="controls-left">
            <!-- 播放/暂停按钮和时间信息 -->
            <v-btn @click="togglePlayPause" variant="text">
              <v-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</v-icon>
            </v-btn>
            <div class="time-display">{{ currentTime }} / {{ formattedDuration }}</div>
          </div>
          <div class="controls-center">
            <!-- 新增评论按钮 -->
            <v-btn variant="text">评论</v-btn>
          </div>
          <div class="controls-right">
            <!-- 设置、声音、全屏按钮 -->
            <v-btn icon="volume_up" @click="toggleSound" variant="text">
            </v-btn>
            <v-btn icon="settings" @click="openSettings" variant="text">
            </v-btn>
            <v-btn icon="fullscreen" @click="toggleFullScreen" variant="text">
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="comments-section">
      <Comment/>
    </div>
  </div>
</template>

<script setup>
import { useDrawer } from "~/composables/states"
import * as THREE from "three"
import FOG from "vanta/src/vanta.fog"
import Comment from "./comment.vue";

const isPlaying = ref(false)
const progress = ref(0)
const showThumbFlag = ref(false) // 新增，用于控制进度条指示器的显示
const controlsRef = ref(null)
const showControlsFlag = ref(false)
const currentTime = ref('00:00') // 当前播放时间
const formattedDuration = ref('20:00') // 格式化的视频总时长
let hideTimeout = null // 用于延迟隐藏的定时器
const drawer = useDrawer()

const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
  // 控制视频播放或暂停的逻辑
}

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

const showThumb = () => {
  showThumbFlag.value = true
}

const hideThumb = () => {
  showThumbFlag.value = false
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
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -2rem;
}
.controls-left, .controls-center, .controls-right {
  flex: 1;
  display: flex;
  align-items: center;
}
.controls-left {
  justify-content: start;
}
.controls-center {
  justify-content: center;
}
.controls-right {
  justify-content: end;
}
.time-display {
  margin-left: 8px;
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
