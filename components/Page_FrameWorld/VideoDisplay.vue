<template>
  <div class="video-window" ref="plyrContainer">
    <video id="player" controls>
      <source :src="videoSource" type="video/mp4">
      <!-- 添加更多源以支持不同格式 -->
    </video>
  </div>
</template>

<script setup>
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const plyrContainer = ref(null);
const videoSource = '/videos/Anatomy_Of_A_Fall.mp4'; // 调整为你的本地视频路径
const props = defineProps({
  currentTime: Number // 接受外部的当前时间
});
let player = null;

onMounted(() => {
  player = new Plyr(plyrContainer.value.querySelector('#player'), {
    controls: ['play', 'current-time', 'duration','progress', 'mute', 'volume', 'fullscreen'],
  });
});

onUnmounted(() => {
  if (player) {
    player.destroy();
  }
});
watch(() => props.currentTime, (newTime) => {
  if (player && newTime !== undefined) {
    player.currentTime = newTime; // 更新 Plyr 的当前播放时间
  }
});
</script>

<style scoped>
.video-window{
  width: auto;
  height: auto;
  display: flex;
}
</style>
