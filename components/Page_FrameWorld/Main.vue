<template>
  <div class="main-container" ref="vantaRef">
    <div class="main-field">
      <div class="displayer-up">
        <VideoDisplay :currentTime="currentTime"/>
        <framecomment v-if="showFrameComments && isAtMarker" class="frame-comments" :currentTimestamp="currentTimestamp" :uniqueTimestamps="uniqueTimestamps"/>
        <!-- 评论卡片 -->
        <transition name="fade">
          <div class="comment-card" v-if="showCommentCard">
            <div class="close-btn" @click="toggleCommentCard">✖</div>
            <textarea class="root-new-comment" ref="textArea" v-model="newCommentContent"
                placeholder="在当前时间点发表评论..." :rows="rows" @input="handleInput"
                @focus="showActions = true" @blur="onBlur"></textarea>
            <div v-show="showActions" class="comment-actions">
              <v-btn class="pink_btn" @click="submitComment">提交</v-btn>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="displayer-control">
      <ProgressBar :entry="entry" :uniqueTimestamps="uniqueTimestamps" @update-time="setCurrentTime"
                   @toggle-comments="handleToggleComments" @open-comment-card="toggleCommentCard" @new-comment="handlenewcomment"/>
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
const user = useUser();
const props = defineProps({
  entry: Object
});

const uniqueTimestamps = ref([]);// 进度条评论标记点
let hideTimeout = null;// 用于延迟隐藏的定时器
const currentTimestamp = ref(0);
const currentTime = ref(0);
const setCurrentTime = (time) => {
  currentTimestamp.value = time;
  currentTime.value = time;
};

const showFrameComments = ref(true);

const handleToggleComments = (visible) => {
  showFrameComments.value = visible;
};
const handlenewcomment = (time) => {
  uniqueTimestamps.value.push(time);
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

// 控制评论卡片显示与隐藏
const rows = ref(2);
const showCommentCard = ref(false);
const showActions = ref(false);
function toggleCommentCard() {
  showCommentCard.value = !showCommentCard.value;
}

const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines;
};

const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 300);
};

// 添加根评论
const newCommentContent = ref('');
const { addComment } = useAddComment(true);
const submitComment = async () => {
  const newComment = await addComment({
    entryId: entryId.value,
    content: newCommentContent.value,
    userID: user.value.id,
    timestamp: currentTimestamp.value,
  });
  if (newComment) {
    uniqueTimestamps.value.push(currentTimestamp.value);
    newCommentContent.value = '';
  }
};

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
  width: 925px;
  height: 500px;
  backdrop-filter: blur(50px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  flex-direction: column;
  display: flex;
  margin-top: 1rem;
  border-radius: 20px 20px 0 0;
}
.displayer-up {
  position: absolute;
  width: 100%; /* 充满整个宽度 */
  height: 100%; /* 充满整个高度 */
}
.displayer-control {
  width: 925px;
  height: auto;
  background-color: rgba(255, 255, 255, 0.8);
  position: relative;
  padding: 10px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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
  width: 925px;
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
.comment-card {
  width: 50%;
  height: 30%;
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: absolute;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px; /* 或根据需要调整 */
  color: #666; /* 或根据设计调整颜色 */
}
.root-new-comment {
  width: 100%; /* 确保输入框宽度适应容器 */
  padding: 10px 12px;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
  box-shadow: none;
  transition: background-color 0.3s, border-color 0.3s;
  resize: none; /* 禁用用户调整大小 */
  margin-top: 1.2rem;
}

.root-new-comment:hover, .root-new-comment:focus {
  background-color: #fff ;
}
.root-new-comment:focus {
  border-color: #f0f0f0 !important;
  outline: none;
}
.comment-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
.pink_btn {
  border: 1.5px solid #f89898; /* 设置边框为粉色 */
  background-color: white !important; /* 设置背景色为白色 */
  color: #f89898 !important; /* 设置文本颜色为粉色 */
  box-shadow: 2px 2px 0px #f89898; /* 设置右侧和下侧的窄阴影为粉色 */
  transition: all 0.3s ease; /* 过渡动画，让颜色变化更平滑 */
  margin: 0 auto; /* 水平居中 */
  font-size: 1.1rem;  /* 设置字体大小和粗细 */
  font-weight: bold;
}

.pink_btn:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none ; /* 鼠标悬停时，移除阴影 */
}

</style>
