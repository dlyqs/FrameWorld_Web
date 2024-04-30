<template>
  <div class="custom-progress-bar" ref="progressBar" tabindex="0" @click="seek" @mousemove="updateHoverPosition" @mouseleave="hideHoverBox">
    <div class="progress-track">
      <div class="progress-filled" :style="{width: progressBarWidth}"></div>
      <div class="progress-marker" v-for="timestamp in uniqueTimestamps" :key="timestamp" :style="{left: calculateMarkerPosition(timestamp)}"></div>
    </div>
    <div class="progress-hover" v-if="showHover & !showHover_larger" :style="{ left: hoverPosition + 'px' }">
      <div class="hover-arrow-up"></div>
      <div class="hover-arrow-down"></div>
      <div class="hover-time">{{ formatTime(currentTime) }}</div>
    </div>
    <div class="progress-hover-larger" v-if="showHover & showHover_larger" :style="{ left: hoverPosition + 'px' }">
      <div class="scale">
        <div v-for="(sec, index) in scaleRange" :key="sec" class="scale-mark" :class="{ 'is-marker': markersOnScale.includes(sec),'scale-mark-current-time': isCurrentTime(sec) }">
          <span :class="{ 'current-time': isCurrentTime(sec) }">{{ index === 0 || index === scaleRange.length - 1 ? formatTime(sec) : formatSeconds(sec) }}</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="control-panel">
    <div class="comment-summary">
      <span>共{{ total_frameComment_user }}个用户</span>
      <span>发布{{ total_frameComment }}条帧评论</span>
    </div>
    <div class="comment-timestamp">{{ formatTime(currentTime) }}</div>
    <div class="control-button-group">
      <button class="control-button left-button" @click="adjustTimeByKey({key: 'ArrowLeft'})"><v-icon class="left-icon" icon="arrow_right_alt"/></button>
      <button class="control-button right-button" @click="adjustTimeByKey({key: 'ArrowRight'})"><v-icon class="right-icon" icon="arrow_right_alt"/></button>
      <button class="larger-hover-button" @click="enlarger_hover">
        <svg class="icon-show-comments" v-if="showHover_larger" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M919.264 905.984l-138.912-138.912C851.808 692.32 896 591.328 896 480c0-229.376-186.624-416-416-416S64 250.624 64 480s186.624 416 416 416c95.008 0 182.432-32.384 252.544-86.208l141.44 141.44a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0.032-45.248zM128 480C128 285.92 285.92 128 480 128s352 157.92 352 352-157.92 352-352 352S128 674.08 128 480z"></path><path d="M625.792 448H336a32 32 0 0 0 0 64h289.792a32 32 0 1 0 0-64z"></path></svg>
        <svg class="icon-hide-comments" v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M919.264 905.984l-138.912-138.912C851.808 692.32 896 591.328 896 480c0-229.376-186.624-416-416-416S64 250.624 64 480s186.624 416 416 416c95.008 0 182.432-32.384 252.544-86.208l141.44 141.44a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0.032-45.248zM128 480C128 285.92 285.92 128 480 128s352 157.92 352 352-157.92 352-352 352S128 674.08 128 480z"></path><path d="M625.792 448H512v-112a32 32 0 0 0-64 0V448h-112a32 32 0 0 0 0 64H448v112a32 32 0 1 0 64 0V512h113.792a32 32 0 1 0 0-64z"></path></svg>
      </button>
      <button class="toggle-comments-button" @click="toggleFrameComments">
        <svg class="icon-hide-comments" v-if="showFrameComments" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.989 4.828c-.47 0-.975.004-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 1.5c-.681.018-1.403.04-2.164.068a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.9-.032-1.743-.058-2.531-.078l1.05-1.46a1.008 1.008 0 0 0-1.638-1.177l-1.862 2.59c-.38-.004-.744-.007-1.088-.007h-.13Zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.59 8.59 0 0 0 .748-1.42L15.183 7.8a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858h1.254Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902h1.254v.902h-1.254Z" clip-rule="evenodd"></path><path fill="#00AEEC" fill-rule="evenodd" d="M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 0-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295Z" clip-rule="evenodd"></path></svg>
        <svg class="icon-show-comments" v-else xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24"><path fill-rule="evenodd" d="m8.085 4.891-.999-1.499a1.008 1.008 0 0 1 1.679-1.118l1.709 2.566c.54-.008 1.045-.012 1.515-.012h.13c.345 0 .707.003 1.088.007l1.862-2.59a1.008 1.008 0 0 1 1.637 1.177l-1.049 1.46c.788.02 1.631.046 2.53.078 1.958.069 3.468 1.6 3.74 3.507.088.613.13 2.158.16 3.276l.001.027c.01.333.017.63.025.856a.987.987 0 0 1-1.974.069c-.008-.23-.016-.539-.025-.881v-.002c-.028-1.103-.066-2.541-.142-3.065-.143-1.004-.895-1.78-1.854-1.813-2.444-.087-4.466-.13-6.064-.131-1.598 0-3.619.044-6.063.13a2.037 2.037 0 0 0-1.945 1.748c-.15 1.04-.225 2.341-.225 3.904 0 1.874.11 3.474.325 4.798.154.949.95 1.66 1.91 1.708a97.58 97.58 0 0 0 5.416.139.988.988 0 0 1 0 1.975c-2.196 0-3.61-.047-5.513-.141A4.012 4.012 0 0 1 2.197 17.7c-.236-1.446-.351-3.151-.351-5.116 0-1.64.08-3.035.245-4.184A4.013 4.013 0 0 1 5.92 4.96c.761-.027 1.483-.05 2.164-.069Zm4.436 4.707h-1.32v4.63h2.222v.848h-2.618v1.078h2.431a5.01 5.01 0 0 1 3.575-3.115V9.598h-1.276a8.59 8.59 0 0 0 .748-1.42l-1.089-.384a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.289h-3.2v.979h2.067v1.43H7.483l-.308 3.454h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.004c.285.02.551.04.818.04 1.001-.066 1.562-.418 1.694-1.056.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858H15.8Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902H15.8v.902h-1.254Zm3.517 10.594a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-.002-1.502a2.5 2.5 0 0 1-2.217-3.657l3.326 3.398a2.49 2.49 0 0 1-1.109.259Zm2.5-2.5c0 .42-.103.815-.286 1.162l-3.328-3.401a2.5 2.5 0 0 1 3.614 2.239Z" clip-rule="evenodd"></path></svg>
      </button>
      <button class="settings-button">
        <svg class="icon-settings-comments" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="m15.645 4.881 1.06-1.473a.998.998 0 1 0-1.622-1.166L13.22 4.835a110.67 110.67 0 0 0-1.1-.007h-.131c-.47 0-.975.004-1.515.012L8.783 2.3A.998.998 0 0 0 7.12 3.408l.988 1.484c-.688.019-1.418.042-2.188.069a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363c1.903.094 3.317.141 5.513.141a.988.988 0 0 0 0-1.975 97.58 97.58 0 0 1-5.416-.139 2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.005.183.01.07.014-.038.004-.096.008-.189.011-.081a.987.987 0 1 0 1.974-.069c-.004-.105-.007-.009-.011.09-.002.056-.004.112-.007.135l-.002.01a.574.574 0 0 1-.005-.091v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.905-.032-1.752-.058-2.543-.079Zm-3.113 4.703h-1.307v4.643h2.2v.04l.651-1.234c.113-.215.281-.389.482-.509v-.11h.235c.137-.049.283-.074.433-.074h1.553V9.584h-1.264a8.5 8.5 0 0 0 .741-1.405l-1.078-.381c-.24.631-.501 1.23-.806 1.786h-1.503l.686-.305c-.228-.501-.5-.959-.806-1.394l-1.034.348c.294.392.566.839.817 1.35Zm-1.7 5.502h2.16l-.564 1.068h-1.595v-1.068Zm-2.498-1.863.152-1.561h1.96V8.289H7.277v.969h2.048v1.435h-1.84l-.306 3.51h2.254c0 1.155-.043 1.906-.12 2.255-.076.348-.38.523-.925.523-.305 0-.61-.022-.893-.055l.294 1.056.061.005c.282.02.546.039.81.039.991-.065 1.547-.414 1.677-1.046.11-.631.175-1.883.175-3.757H8.334Zm5.09-.8v.85h-1.188v-.85h1.187Zm-1.188-.955h1.187v-.893h-1.187v.893Zm2.322.007v-.893h1.241v.893h-1.241Zm.528 2.757a1.26 1.26 0 0 1 1.087-.627l4.003-.009a1.26 1.26 0 0 1 1.094.63l1.721 2.982c.226.39.225.872-.001 1.263l-1.743 3a1.26 1.26 0 0 1-1.086.628l-4.003.009a1.26 1.26 0 0 1-1.094-.63l-1.722-2.982a1.26 1.26 0 0 1 .002-1.263l1.742-3Zm1.967.858a1.26 1.26 0 0 0-1.08.614l-.903 1.513a1.26 1.26 0 0 0-.002 1.289l.885 1.492c.227.384.64.62 1.086.618l2.192-.005a1.26 1.26 0 0 0 1.08-.615l.904-1.518a1.26 1.26 0 0 0 .001-1.288l-.884-1.489a1.26 1.26 0 0 0-1.086-.616l-2.193.005Zm2.517 2.76a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" clip-rule="evenodd"></path></svg>
      </button>
    </div>
    <textarea class="new-comment-input" v-model="newCommentContent" ref="textArea" placeholder="在当前时间点发表评论..." 
              :rows="rows" @input="handleInput" @blur="onBlur"></textarea>
    <v-btn class="new-comment-submit" @click="submitComment">Send</v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  entry: Object,
  uniqueTimestamps: Array,
});

const rows = ref(1);
const entryId = useEntryId();       // 假设当前条目ID，后期动态获取
const progress = ref(0);
const hoverTime = ref(0);
const snapRange = ref(30);    // 设置吸附范围（秒）
const currentTime = ref(0);   // 当前播放时间
const hoverPosition = ref(0);
const total_frameComment = ref(0);
const total_frameComment_user = ref(0);
const newCommentContent = ref('');
const progressBar = ref(null);
const isDragging = ref(false);
const showHover = ref(false);
const showHover_larger = ref(false);
const showActions = ref(false);
const showFrameComments = ref(true);

const user = useUser();
const maxProgress = computed(() => props.entry?.length || 0);
const progressBarWidth = computed(() => `${(progress.value / maxProgress.value) * 100}%`);

const emit = defineEmits(['update-time', 'toggle-comments','open-comment-card','new-comment']);

/*————————————————————————显示控制、工具函数————————————————————————*/
// 控制帧评论显示
const toggleFrameComments = () => {
  showFrameComments.value = !showFrameComments.value;
  emit('toggle-comments', showFrameComments.value);
};

// 控制进度条hover显示
function hideHoverBox() {
  showHover.value = false;
}

// 放大显示控制
const enlarger_hover = () => {
  showHover_larger.value = !showHover_larger.value;
};

// 输入效果控制
const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 4 ? 4 : lines;
};

const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 300);
};

// 格式化时间
function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
const formatSeconds = (timeInSeconds) => {
  const seconds = timeInSeconds % 60;
  return seconds.toString().padStart(2, '0'); // 保持两位数字显示
};

/*————————————————————————进度条hover功能————————————————————————*/
// 计算当前鼠标位置前后指定范围内的平均间隔
function calculateAverageInterval(currentTime, range, timestamps) {
  const relevantTimestamps = timestamps.filter(t => Math.abs(t - currentTime) <= range);
  relevantTimestamps.sort((a, b) => a - b); // 确保时间戳是排序的

  let totalInterval = 0;
  for (let i = 1; i < relevantTimestamps.length; i++) {
    totalInterval += relevantTimestamps[i] - relevantTimestamps[i - 1];
  }

  return relevantTimestamps.length > 1 ? totalInterval / (relevantTimestamps.length - 1) : range;
}

// 更新hover的位置
function updateHoverPosition(event) {
  showHover.value = true;
  const rect = progressBar.value.getBoundingClientRect();
  let x = event.clientX - rect.left;
  x = Math.max(0, x);
  x = Math.min(rect.width, x);
  hoverPosition.value = x;
  const progressPercentage = x / rect.width;
  let potentialTime = Math.min(maxProgress.value, Math.max(0, Math.floor(progressPercentage * maxProgress.value)));

  currentTime.value = potentialTime; // 实时更新currentTime
  hoverTime.value = potentialTime; // 更新hoverTime

  // 计算前后30秒的平均间隔
  snapRange.value = calculateAverageInterval(potentialTime, 30, props.uniqueTimestamps); // 更新吸附范围

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
    if (!showHover_larger.value) {
      currentTime.value = closestMarker;  // 在关闭放大显示时，使得可以吸附到位置且同时设置到该标记点时间。
    }

    hoverPosition.value = (closestMarker / maxProgress.value) * rect.width;
  }
}

// 刻度放大显示
const scaleRange = computed(() => {
  let baseTime = hoverTime.value;
  return Array.from({ length: 15 }, (_, i) => baseTime - 7 + i); // 生成从baseTime-5到baseTime+5的范围
});

// 当前刻度范围内的标记点
const markersOnScale = computed(() => {
  return scaleRange.value.filter(time => props.uniqueTimestamps.includes(time));
});

// 标记当前时间的刻度
const isCurrentTime = (time) => {
  return time === currentTime.value;
};

/*————————————————————————进度条点击功能————————————————————————*/
function seek(event) {
  event.preventDefault();
  const rect = progressBar.value.getBoundingClientRect();
  const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
  const progressPercentage = x / rect.width;

  let clickedTime = Math.floor(progressPercentage * maxProgress.value);
  // 计算前后20秒的平均间隔
  snapRange.value = calculateAverageInterval(clickedTime, 20, props.uniqueTimestamps); // 更新吸附范围

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
    clickedTime = closestMarker; // If close to a marker, snap to it. Set the time to the closest marker
  }
  currentTime.value = clickedTime;
  progress.value = progressPercentage * maxProgress.value;
  emit('update-time', currentTime.value);
}

/*————————————————————————添加帧评论————————————————————————*/
const { addComment } = useAddComment(true);
const submitComment = async () => {
  const newComment = await addComment({
    entryId: entryId.value,
    content: newCommentContent.value,
    userID: user.value.id,
    timestamp: currentTime.value
  });
  if (newComment) {
    emit('new-comment', currentTime.value);
    newCommentContent.value = '';
    total_frameComment.value += 1;
  }
};

/*————————————————————————加载帧评论————————————————————————*/
// 加载帧评论数量和不同用户数量
const loadComments = async () => {

    try {
      console.log('progress entryid:', entryId.value);
      const response = await fetch(`/api/frameworld/frame_comments/?entry=${entryId.value}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const comments = await response.json() || [];

      total_frameComment.value = comments.length; // 更新总评论数

      // 新增代码: 计算不同userid的数量
      const userIds = new Set(comments.map(comment => comment.user));
      total_frameComment_user.value = userIds.size; // 更新不同用户ID的数量
      console.log('progress total:', total_frameComment.value);
      console.log('progress total_user:', total_frameComment_user.value);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }

};
onMounted(loadComments);

// 使用 watch 监听 entryId 的变化
watch(entryId, (newId, oldId) => {
  if (newId !== oldId) {
    loadComments();
  }
});

// 计算帧评论标记位置
function calculateMarkerPosition(timestamp) {
  const positionPercentage = (timestamp / maxProgress.value) * 100;
  return `${positionPercentage}%`;
}

/*————————————————————————键盘事件响应————————————————————————*/
// 键盘方向键控制进度条
const adjustTimeByKey = (event) => {
  if (event.key === "ArrowRight") {
    // 右箭头键增加时间
    currentTime.value = Math.min(currentTime.value + 1, maxProgress.value);
  } else if (event.key === "ArrowLeft") {
    // 左箭头键减少时间
    currentTime.value = Math.max(currentTime.value - 1, 0);
  }
  // 更新视频播放时间
  emit('update-time', currentTime.value);
  // 更新进度条filled和thumb位置，由于已经是动态绑定，所以只需要更新progress.value值即可
  progress.value = (currentTime.value / maxProgress.value) * maxProgress.value;
};

// 确保添加了正确的侦听器
onMounted(() => {
  window.addEventListener('keydown', adjustTimeByKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', adjustTimeByKey);
});
</script>

<style scoped>
/* 进度条 */
.custom-progress-bar {
  position: relative;
  margin: 1.3rem auto auto;
  width: 95%;
  height: 5px;
  cursor: pointer;
  border-radius: 50%;
  outline: none;
}
.custom-progress-bar:focus {
  outline: none;
}
.custom-progress-bar::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 20px;
  background-color: transparent;
  pointer-events: auto;
}
.progress-track {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 15px;
}
.progress-filled {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ffcad4;
  border-radius: 15px;
}
.progress-marker {
  position: absolute;
  top: -3px; /* Adjust according to your design */
  width: 2px;
  height: 12px;
  background-color: #003366; /* Orange color for visibility */
  transform: translateX(-50%); /* Center the marker */
  border-radius: 2rem;
}

/* 进度条hover */
.progress-hover {
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

/* 进度条hover-larger */
.progress-hover-larger {
  position: absolute;
  bottom: 2.6rem; /* 留出空间给指示器 */
  margin-left: -17.25rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  width: auto;
}
.scale {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.scale-mark {
  position: relative;
  flex: 0 0 auto; /* 不让刻度伸缩 */
  text-align: center; /* 使刻度标签居中 */
  font-size: 0.8rem; /* 默认字体大小 */
  padding: .5rem;
}
.scale-mark::after {
  content: '';
  position: absolute;
  top: 70%;
  height: 10px;
  width: 2px;
  background-color: pink;
  transform: translateX(-50%);
  border-radius: 10px;
}
.scale-mark span {
  display: block; /* 块级显示使对齐更简洁 */
}
.current-time {
  font-size: 1.4rem; /* 当前时间的字体更大 */
  font-weight: bold;
  margin-top: -0.3rem;
}
.scale-mark-current-time {
  transform: scale(1.3); /* 放大刻度 */
  transition: transform 0.3s ease; /* 平滑过渡效果 */
  margin-top: -0.8rem;
}
.scale-mark-current-time::after {
  background-color: red !important; /* 当前时间的标记点颜色更深 */
}
.is-marker span {
  color: red; /* 标记点用红色突出显示 */
  font-weight: bold;
}

/* 进度条控制区 */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.2rem;
  padding: 0 10px;
}
.comment-summary {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  font-weight: bold;
  margin-right: auto; /* 推动所有后面的元素到右边 */
  padding-left: 10px;
  margin-top: .2rem;
  flex: 0 0 15%; /* 固定宽度 */
}
.comment-timestamp{
  display: flex;
  font-size: 1rem;
  padding-left: .5rem;
  margin-top: .2rem;
  flex: 0 0 7%; /* 固定宽度 */
}
.control-button-group {
  display: flex;
  justify-content: center; /* 中间按钮群居中对齐 */
  align-items: center;
  flex-grow: 1; /* 允许按钮组填充剩余空间 */
  margin-top: .3rem;
}
.control-button{
  padding: 0.2rem;
  font-size: 1.5rem;
}
.left-button{
  rotate: 180deg;
  margin-top: .25rem;
}
.larger-hover-button{
  margin-left: 3rem;
}
.toggle-comments-button {
  margin-right: 10px; /* 在显示/隐藏评论按钮和输入区域之间添加间距 */
  margin-left: 1rem;
}
.control-button, .larger-hover-button, .toggle-comments-button, .settings-button {
  flex: 0 0 auto; /* 保证按钮不被压缩或扩展 */
}
.icon-settings-comments, .icon-show-comments, .icon-hide-comments {
  width: 24px; /* 示例大小，根据需要调整 */
  height: 24px;
  fill: currentColor; /* 使SVG图标继承文本颜色 */
}

.new-comment-input {
  padding: 8px 12px;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
  box-shadow: none;
  transition: background-color 0.3s, border-color 0.3s;
  resize: none; /* 禁用用户调整大小 */
  flex: 0 0 38%;
  margin-right: 10px;
}
.new-comment-input, .new-comment-submit {
  display: flex;
  align-items: center;
}
.new-comment-input:hover, .new-comment-input:focus {
  background-color: #fff ;
}
.new-comment-input:focus {
  border-color: #f0f0f0 !important;
  outline: none;
}
.new-comment-submit {
  flex: 0 0 auto;
  border: 1.5px solid #f89898; /* 设置边框为粉色 */
  background-color: white !important; /* 设置背景色为白色 */
  color: #f89898 !important; /* 设置文本颜色为粉色 */
  box-shadow: 2px 2px 0 #f89898; /* 设置右侧和下侧的窄阴影为粉色 */
  transition: all 0.3s ease; /* 过渡动画，让颜色变化更平滑 */
  font-size: 1.1rem;  /* 设置字体大小和粗细 */
  font-weight: bold;
}
.new-comment-submit:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none ; /* 鼠标悬停时，移除阴影 */
}
</style>