<template>
  <div class="video-window" ref="plyrContainer">
    <video id="player" controls>
      <source :src="videoSource" type="video/mp4">
    </video>
  </div>
</template>

<script setup>
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const props = defineProps({
  currentTime: Number
});
const entryId = useEntryId(); // 假设当前条目ID，后期动态获取
const plyrContainer = ref(null);
const videoSource = '/videos/Anatomy_Of_A_Fall.mp4'; // 视频路径
let player = null;

// 初始化 Plyr 播放器
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

// 监听 progressbar 变化，更新 Plyr 播放时间
watch(() => props.currentTime, (newTime) => {
  if (player && newTime !== undefined) {
    player.currentTime = newTime;
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
