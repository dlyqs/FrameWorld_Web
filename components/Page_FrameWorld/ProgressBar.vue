<template>
  <!-- 自定义进度条 -->
  <div class="custom-progress-bar" @click="seek" @mousemove="updateHoverPosition" @mouseleave="hideHoverBox" ref="progressBar">
    <div class="progress-bar-background">
      <div class="progress-bar-foreground" :style="{width: progressBarWidth}"></div>
      <div v-for="timestamp in uniqueTimestamps" :key="timestamp" class="progress-marker" :style="{left: calculateMarkerPosition(timestamp)}"></div>
    </div>
    <div class="progress-thumb" :style="{left: thumbPosition}" @mousedown="startDrag" @mouseenter="showThumb" @mouseleave="hideThumb">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs><clipPath id="__lottie_element_55"><rect width="24" height="24" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_55)"><g transform="matrix(0.9883429408073425,-0.7275781631469727,0.6775955557823181,0.920446515083313,7.3224687576293945,-0.7606706619262695)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0.9937776327133179,-0.11138220876455307,0.11138220876455307,0.9937776327133179,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(51,51,51)" fill-opacity="1" d=" M0.75,-1.25 C0.75,-1.25 0.75,1.25 0.75,1.25 C0.75,1.663925051689148 0.4139249920845032,2 0,2 C0,2 0,2 0,2 C-0.4139249920845032,2 -0.75,1.663925051689148 -0.75,1.25 C-0.75,1.25 -0.75,-1.25 -0.75,-1.25 C-0.75,-1.663925051689148 -0.4139249920845032,-2 0,-2 C0,-2 0,-2 0,-2 C0.4139249920845032,-2 0.75,-1.663925051689148 0.75,-1.25z"></path></g></g><g transform="matrix(1.1436611413955688,0.7535901665687561,-0.6317168474197388,0.9587040543556213,16.0070743560791,2.902894973754883)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0.992861807346344,0.1192704513669014,-0.1192704513669014,0.992861807346344,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(51,51,51)" fill-opacity="1" d=" M0.75,-1.25 C0.75,-1.25 0.75,1.25 0.75,1.25 C0.75,1.663925051689148 0.4139249920845032,2 0,2 C0,2 0,2 0,2 C-0.4139249920845032,2 -0.75,1.663925051689148 -0.75,1.25 C-0.75,1.25 -0.75,-1.25 -0.75,-1.25 C-0.75,-1.663925051689148 -0.4139249920845032,-2 0,-2 C0,-2 0,-2 0,-2 C0.4139249920845032,-2 0.75,-1.663925051689148 0.75,-1.25z"></path></g></g><g transform="matrix(1,0,0,1,8.890999794006348,8.406000137329102)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0.09099999815225601,1.1009999513626099)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M7,-3 C7,-3 7,3 7,3 C7,4.379749774932861 5.879749774932861,5.5 4.5,5.5 C4.5,5.5 -4.5,5.5 -4.5,5.5 C-5.879749774932861,5.5 -7,4.379749774932861 -7,3 C-7,3 -7,-3 -7,-3 C-7,-4.379749774932861 -5.879749774932861,-5.5 -4.5,-5.5 C-4.5,-5.5 4.5,-5.5 4.5,-5.5 C5.879749774932861,-5.5 7,-4.379749774932861 7,-3z"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(51,51,51)" stroke-opacity="1" stroke-width="1.5" d=" M7,-3 C7,-3 7,3 7,3 C7,4.379749774932861 5.879749774932861,5.5 4.5,5.5 C4.5,5.5 -4.5,5.5 -4.5,5.5 C-5.879749774932861,5.5 -7,4.379749774932861 -7,3 C-7,3 -7,-3 -7,-3 C-7,-4.379749774932861 -5.879749774932861,-5.5 -4.5,-5.5 C-4.5,-5.5 4.5,-5.5 4.5,-5.5 C5.879749774932861,-5.5 7,-4.379749774932861 7,-3z"></path></g></g><g transform="matrix(1,0,0,1,8.89900016784668,8.083999633789062)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(51,51,51)" fill-opacity="1" d=" M0.875,-1.125 C0.875,-1.125 0.875,1.125 0.875,1.125 C0.875,1.607912540435791 0.48291251063346863,2 0,2 C0,2 0,2 0,2 C-0.48291251063346863,2 -0.875,1.607912540435791 -0.875,1.125 C-0.875,1.125 -0.875,-1.125 -0.875,-1.125 C-0.875,-1.607912540435791 -0.48291251063346863,-2 0,-2 C0,-2 0,-2 0,-2 C0.48291251063346863,-2 0.875,-1.607912540435791 0.875,-1.125z"></path></g></g><g transform="matrix(1,0,0,1,14.008999824523926,8.083999633789062)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(51,51,51)" fill-opacity="1" d=" M0.8999999761581421,-1.100000023841858 C0.8999999761581421,-1.100000023841858 0.8999999761581421,1.100000023841858 0.8999999761581421,1.100000023841858 C0.8999999761581421,1.596709966659546 0.4967099726200104,2 0,2 C0,2 0,2 0,2 C-0.4967099726200104,2 -0.8999999761581421,1.596709966659546 -0.8999999761581421,1.100000023841858 C-0.8999999761581421,1.100000023841858 -0.8999999761581421,-1.100000023841858 -0.8999999761581421,-1.100000023841858 C-0.8999999761581421,-1.596709966659546 -0.4967099726200104,-2 0,-2 C0,-2 0,-2 0,-2 C0.4967099726200104,-2 0.8999999761581421,-1.596709966659546 0.8999999761581421,-1.100000023841858z"></path></g></g></g>
      </svg>
    </div>
    <div class="hover-box" v-if="showHover" :style="{ left: hoverPosition + 'px' }">
      <div class="hover-time">{{ hoverTimeFormatted }}</div>
      <div class="hover-arrow-up"></div>
      <div class="hover-arrow-down"></div>
    </div>
  </div>
  <!-- 控制按钮行 -->
  <div class="controls-row">
    <div class="controls-left">
      <v-btn @click="togglePlayPause" variant="text">
        <v-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</v-icon>
      </v-btn>
      <div class="time-display">{{ currentTimeFormatted }} / {{ durationFormatted }}</div>
    </div>
    <div class="controls-center">
      <v-btn class="btn-new-comment">+</v-btn>
    </div>
    <div class="controls-right">
      <button @click="toggleFrameComments">{{ showFrameComments ? '隐藏评论' : '显示评论' }}</button>
      <v-btn icon="volume_up" variant="text"></v-btn>
      <v-btn icon="settings" variant="text"></v-btn>
      <v-btn icon="fullscreen" variant="text"></v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  entry: Object,
  uniqueTimestamps: Array,
});

// Reactive states、Flags、DOM refs
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const currentTime = ref(0); // 当前播放时间
const progress = ref(0);
const hoverPosition = ref(0);
const hoverTime = ref(0);
const snapRange = ref(20); // 设置吸附范围（秒）
const isPlaying = ref(false);
const isDragging = ref(false);
const showThumbFlag = ref(false);
const showHover = ref(false);
const progressBar = ref(null);

// Computed properties
const maxProgress = computed(() => props.entry?.length || 0);
const progressBarWidth = computed(() => `${(progress.value / maxProgress.value) * 100}%`);
const thumbPosition = computed(() => `${Math.min(100, Math.max(0, (progress.value / maxProgress.value) * 100))}%`);
const durationFormatted = computed(() => formatTime(props.entry?.length));
const currentTimeFormatted = computed(() => formatTime(currentTime.value));
const hoverTimeFormatted = computed(() => formatTime(hoverTime.value));

const showFrameComments = ref(true);
const emit = defineEmits(['update-time', 'toggle-comments']);
const toggleFrameComments = () => {
  showFrameComments.value = !showFrameComments.value;
  emit('toggle-comments', showFrameComments.value);
};

function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateCurrentTime(progressPercentage) {
  currentTime.value = Math.floor(progressPercentage * maxProgress.value);
}

function seek(event) {
  event.preventDefault();
  const rect = progressBar.value.getBoundingClientRect();
  const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
  const progressPercentage = x / rect.width;

  let clickedTime = Math.floor(progressPercentage * maxProgress.value);

  // Check for snap to nearest marker
  let closestMarker = null;
  let closestDistance = Infinity;
  for (let timestamp of props.uniqueTimestamps) {
    let markerPosition = (timestamp / maxProgress.value) * rect.width;
    let distance = Math.abs(markerPosition - x);
    if (distance < closestDistance) {
      closestMarker = timestamp;
      closestDistance = distance;
    }
  }

  if (closestDistance <= snapRange.value * rect.width / maxProgress.value) {
    // If close to a marker, snap to it
    hoverTime.value = closestMarker;
    hoverPosition.value = (closestMarker / maxProgress.value) * rect.width;
    clickedTime = closestMarker; // Set the time to the closest marker
  } else {
    hoverTime.value = clickedTime;
    hoverPosition.value = x;
  }

  currentTime.value = clickedTime;
  progress.value = progressPercentage * maxProgress.value;
  emit('update-time', currentTime.value);
  const isAtMarker = props.uniqueTimestamps.includes(currentTime.value);
  if (!isAtMarker) {
    emit('update-time', null); // 发送 null 或特定信号以表示隐藏评论
  }
}

function startDrag(event) {
  event.preventDefault();
  isDragging.value = true;
  window.addEventListener('mousemove', onDragging);
  window.addEventListener('mouseup', stopDrag);
}

function onDragging(event) {
  if (!isDragging.value) return;
  event.preventDefault();
  seek(event);
}

function stopDrag(event) {
  if (!isDragging.value) return;
  event.preventDefault();
  isDragging.value = false;
  window.removeEventListener('mousemove', onDragging);
  window.removeEventListener('mouseup', stopDrag);
}

function calculateMarkerPosition(timestamp) {
  const positionPercentage = (timestamp / maxProgress.value) * 100;
  return `${positionPercentage}%`;
}

const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value;
}

const showThumb = () => {
  showThumbFlag.value = true;
}

const hideThumb = () => {
  showThumbFlag.value = false;
}

function hideHoverBox() {
  showHover.value = false;
}

function updateHoverPosition(event) {
  showHover.value = true;
  const rect = progressBar.value.getBoundingClientRect();
  let x = event.clientX - rect.left;
  x = Math.max(0, x);
  x = Math.min(rect.width, x);
  hoverPosition.value = x;
  const progressPercentage = x / rect.width;
  let potentialTime = Math.min(maxProgress.value, Math.max(0, Math.floor(progressPercentage * maxProgress.value)));

  // Check for snap to marker
  let closestMarker = null;
  let closestDistance = Infinity;
  for (let timestamp of props.uniqueTimestamps) {
    let markerPosition = timestamp * rect.width / maxProgress.value;
    let distance = Math.abs(markerPosition - x);
    if (distance < closestDistance) {
      closestMarker = timestamp;
      closestDistance = distance;
    }
  }

  // 如果鼠标在marker的snapRange内，吸附至marker
  if (closestDistance <= snapRange.value * rect.width / maxProgress.value) {
    hoverTime.value = closestMarker;
    hoverPosition.value = (closestMarker / maxProgress.value) * rect.width;
  } else {
    hoverTime.value = potentialTime;
  }
}

// Watchers
watch(progress, (newProgress) => {
  currentTime.value = Math.floor(newProgress);// 当进度条变化更新 currentTime
});
</script>

<style scoped>
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
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

.custom-progress-bar {
  position: relative;
  margin: auto;
  width: 95%;
  height: 5px;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 50%;
}

.custom-progress-bar::before {
  content: "";
  position: absolute;
  top: -8px; /* Adjust this value to control vertical expansion */
  left: 0;
  right: 0;
  height: 20px; /* This increases the height by adding 8px above and below the original 4px bar */
  background-color: transparent; /* Keep it transparent or match the bar color depending on visual requirements */
  pointer-events: auto; /* Ensure it can register mouse events */
}

.progress-bar-foreground {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ffcad4;
}

.progress-thumb {
  position: absolute;
  margin-top: 1px;
  transform: translateX(-50%) translateY(-50%) scale(0); /* Start hidden and scaled down */
  transition: transform 0.3s ease, opacity 0.3s ease;
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0; /* Start fully transparent */
}

.custom-progress-bar:hover .progress-thumb {
  transform: translateX(-50%) translateY(-50%) scale(1.0); /* Scale up when hovered */
  opacity: 1; /* Fully visible on hover */
}

.progress-bar-background {
  width: 100%;
  height: 100%;
  background-color: white;
}

.progress-marker {
  position: absolute;
  top: -3px; /* Adjust according to your design */
  width: 6px;
  height: 10px;
  background-color: lightgreen; /* Orange color for visibility */
  transform: translateX(-50%); /* Center the marker */
}

.btn-new-comment {
  background-color: white !important; /* 设置背景色为白色 */
  color: #f89898 !important; /* 设置文本颜色为粉色 */
  box-shadow: 2px 2px 0 #f89898; /* 设置右侧和下侧的窄阴影为粉色 */
  transition: all 0.3s ease; /* 过渡动画，让颜色变化更平滑 */
  margin: 0 auto; /* 水平居中 */
  font-size: 2rem; /* 设置字体大小和粗细 */
}

.btn-new-comment:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none; /* 鼠标悬停时，移除阴影 */
}

.hover-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.hover-time {
  position: absolute;
  bottom: 100%;
  transform: translateY(-75%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.hover-arrow-up, .hover-arrow-down {
  content: "";
  position: absolute;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.hover-arrow-up {
  top: 100%;
  border-bottom: 5px solid rgba(0, 0, 0, 0.75);
  margin-top: 0.2rem;
}

.hover-arrow-down {
  bottom: 100%;
  border-top: 5px solid rgba(0, 0, 0, 0.75);
  margin-bottom: 0.5rem;
}
</style>