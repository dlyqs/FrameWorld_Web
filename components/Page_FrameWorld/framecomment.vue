<template>
  <v-container class="frame-comment">
    <v-row class="comment-top">
      <v-col cols="3" class="header-area">
        <span class="header-title">当前帧评论 ({{ totalComments }})</span>
      </v-col>
      <v-col cols="6" class="input-area">
        <textarea class="root-new-comment" ref="textArea" v-model="newCommentContent"
                  placeholder="在当前时间点发表评论..." :rows="rows" @input="handleInput"
                  @focus="showActions = true" @blur="onBlur"></textarea>
        <v-btn class="pink_btn" @click="submitComment">提交</v-btn>
      </v-col>
      <v-col cols="3" class="sort-options">
        <span class="sort-option">最热</span> | <span class="sort-option">最新</span>
      </v-col>
    </v-row>

    <v-row class="comment-bottom">
      <v-col cols="12">
        <v-list three-line class="frame-comment-list">
          <FrameCommentItem v-for="comment in paginatedComments" :key="comment.id" :comment="comment" :currentTimestamp="currentTimestamp"
                            @comment-deleted="handleCommentDeleted" @update-total-comments="totalComments += 1" @reply-added="handleReplyAdded"/>
        </v-list>
        <v-pagination v-model="pagination.page" :length="Math.ceil(totalComments / pagination.itemsPerPage)" :total-visible="4"/>
      </v-col>
    </v-row>
  </v-container>
 </template>

<script setup>
import FrameCommentItem from "./FrameCommentItem.vue";


const props = defineProps({
  currentTimestamp: Number,
  uniqueTimestamps: Array
});
const rows = ref(1);
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const totalComments = ref(0);
const frameComments = ref([]);
const newCommentContent = ref('');
const pagination = ref({ page: 1, itemsPerPage: 5 });
const showActions = ref(false);
const user = useUser();
const isMarker = computed(() => props.uniqueTimestamps.includes(props.currentTimestamp));

// 显示控制
const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 4 ? 4 : lines;
};

const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 300);
};

// 添加根评论
const { addComment } = useAddComment(true);
const submitComment = async () => {
  const newComment = await addComment({
    entryId: entryId.value,
    content: newCommentContent.value,
    userID: user.value.id,
    timestamp: props.currentTimestamp
  });
  if (newComment) {
    frameComments.value.push(newComment);
    totalComments.value += 1;
    newCommentContent.value = '';
  }
};

// 加载评论
async function loadCommentsForTimestamp(timestamp) {
  try {
    const response = await fetch(`/api/frameworld/frame_comments/comments_for_timestamp?entry_id=${entryId.value}&timestamp=${timestamp}`);
    if (response.ok) {
      frameComments.value = await response.json();
      totalComments.value = frameComments.value.length;
    } else {
      console.error('Failed to load frame comments:', response.status);
    }
  } catch (error) {
    console.error('Error fetching frame comments:', error);
  }
}

watch(() => props.currentTimestamp, (newTimestamp) => {
  if (isMarker.value) {
    loadCommentsForTimestamp(newTimestamp);
  }
}, { immediate: true });

// 计算分页后的根评论
const paginatedComments = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.itemsPerPage;
  const end = start + pagination.value.itemsPerPage;
  return frameComments.value.slice(start, end);
});

// 处理回复被添加
const handleReplyAdded = (newReply) => {
  frameComments.value.push(newReply); // 更新回复列表
};
// 处理根评论被删除
const emit = defineEmits(['comment-deleted']);
const handleCommentDeleted = (commentId) => {
  frameComments.value = frameComments.value.filter(c => c.id !== commentId);
};
</script>

<style scoped>
.comment-top{
  position: sticky;
  top: 0;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  padding: 0.5rem 2rem 0.3rem 2rem;
}
.comment-bottom{
  padding: 0 5rem 0 5rem;
}
.header-title {
  font-size: 1.2rem;
  font-weight: bold;
}
.header-area {
  text-align: left; /* 左对齐标题 */
}
.sort-options {
  text-align: right; /* 使排序选项自动填充左侧空间，从而靠右显示 */
}
.sort-options .sort-option {
  cursor: pointer;
  transition: color 0.3s;
  font-weight: bold;
}
.sort-options .sort-option:hover {
  color: pink;
}
.input-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.root-new-comment {
  width: 100%; /* 确保输入框宽度适应容器 */
  padding: 8px 12px;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
  box-shadow: none;
  transition: background-color 0.3s, border-color 0.3s;
  resize: none; /* 禁用用户调整大小 */
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
.frame-comment{
  background-color: white !important; /* 设置背景色为白色 */
  padding: 0;
  overflow-x: hidden;
}
* {
  box-sizing: border-box; /* 确保内边距和边框不会增加宽度 */
}
.frame-comment-list{
  background-color: white; /* 设置背景色为白色 */
  border-radius: 10px; /* 设置边框圆角 */
  border: 1px solid #ccc; /* 设置边框颜色和粗细 */
  padding: 10px; /* 内边距增加些间隙 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加轻微阴影 */
  z-index: 0;
}
/* 针对所有滚动条 */
::-webkit-scrollbar {
  width: .5rem;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.3);
  --tw-border-opacity: 1;
  border-radius: 9999px;
  border-width: 1px;
  transition: background-color 0.3s ease;
  height: 40px; /* 固定高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: rgba(128, 128, 128, 0.6); /* 鼠标悬浮或拖动时不透明 */
}
</style>