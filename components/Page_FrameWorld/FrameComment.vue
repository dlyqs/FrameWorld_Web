<template>
  <v-container class="frame-comment">
    <div class="comment-top">
      <div class="comment-left">
        <span class="total-comments">当前帧评论 ({{ totalComments }})</span>
      </div>
      <div class="comment-center">
        <textarea class="comment-input" v-model="newCommentContent" ref="textArea" placeholder="在当前时间点发表评论..."
                  :rows="rows" @input="handleInput" @focus="showActions = true" @blur="onBlur"></textarea>
        <v-btn class="comment-submit" @click="submitComment">提交</v-btn>
      </div>
      <div class="comment-right">
        <span class="sort-option" @click="sortByPopularity">最热</span> | <span class="sort-option" @click="sortByTime">最新</span>
      </div>
    </div>
    <div class="comment-show">
      <v-list three-line class="comment-list">
        <FrameCommentItem v-for="comment in paginatedComments" :key="comment.id" :comment="comment" :currentTimestamp="currentTimestamp"
                          @comment-deleted="handleCommentDeleted" @update-total-commentss="totalComments += 1" @reply-added="handleReplyAdded"/>
      </v-list>
      <v-pagination v-model="pagination.page" :length="Math.ceil(totalComments / pagination.itemsPerPage)" :total-visible="4"/>
    </div>
  </v-container>
 </template>

<script setup>
import FrameCommentItem from "./FrameCommentItem.vue";

const props = defineProps({
  currentTimestamp: Number,
  uniqueTimestamps: Array,
});
const rows = ref(1);
const entryId = useEntryId();
const totalComments = ref(0);
const frameComments = ref([]);
const newCommentContent = ref('');
const pagination = ref({ page: 1, itemsPerPage: 5 });
const showActions = ref(false);
const user = useUser();
const isMarker = computed(() => props.uniqueTimestamps.includes(props.currentTimestamp));

// 输入框样式控制
const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 4 ? 4 : lines;
};

const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 300);
};

// 添加帧评论
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

// 加载帧评论
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

// 监听当前时间戳变化加载帧评论
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
  frameComments.value.push(newReply);
};

// 处理根评论被删除
const handleCommentDeleted = (commentId) => {
  frameComments.value = frameComments.value.filter(c => c.id !== commentId);
};

// 按热度排序
const sortByPopularity = () => {
  frameComments.value.sort((a, b) => b.popularity - a.popularity);
};

// 按时间排序
const sortByTime = () => {
  frameComments.value.sort((a, b) => new Date(b.time) - new Date(a.time));
};
</script>

<style scoped>
.frame-comment{
  background-color: white !important; /* 设置背景色为白色 */
  padding: 0;
  overflow-x: hidden;
}
/* 上 */
.comment-top{
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  padding: 0.5rem 5rem 0.3rem 5rem;
}
/* 左 */
.comment-left {
  text-align: left;
}
.total-comments {
  font-size: 1.2rem;
  font-weight: bold;
}
/* 中 */
.comment-center {
  display: flex;
  width: 50%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 1rem;
}
.comment-input {
  width: 100%;
  padding: 8px 12px;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
  box-shadow: none;
  transition: background-color 0.3s, border-color 0.3s;
  resize: none; /* 禁用用户调整大小 */
}
.comment-input:hover, .comment-input:focus {
  background-color: #fff ;
}
.comment-input:focus {
  border-color: #f0f0f0 !important;
  outline: none;
}
.comment-submit {
  border: 1.5px solid #f89898; /* 设置边框为粉色 */
  background-color: white !important; /* 设置背景色为白色 */
  color: #f89898 !important; /* 设置文本颜色为粉色 */
  box-shadow: 2px 2px 0px #f89898; /* 设置右侧和下侧的窄阴影为粉色 */
  transition: all 0.3s ease; /* 过渡动画，让颜色变化更平滑 */
  margin: 0 auto; /* 水平居中 */
  font-size: 1.1rem;  /* 设置字体大小和粗细 */
  font-weight: bold;
}
.comment-submit:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none ; /* 鼠标悬停时，移除阴影 */
}
/* 右 */
.comment-right {
  text-align: right;
  margin-top:.5rem;
}
.comment-right .sort-option {
  cursor: pointer;
  transition: color 0.3s;
  font-weight: bold;
}
.comment-right .sort-option:hover {
  color: #f89898;
}
/* 下 */
.comment-show{
  padding: 0 5rem 0 5rem;
}
.comment-list{
  background-color: white; /* 设置背景色为白色 */
  border-radius: 10px; /* 设置边框圆角 */
  border: 1px solid #ccc; /* 设置边框颜色和粗细 */
  padding: 10px; /* 内边距增加些间隙 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加轻微阴影 */
  z-index: 0;
}

/* 页面滚动条及其轨道、滑块样式 */
::-webkit-scrollbar {
  width: .5rem;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.3);
  --tw-border-opacity: 1;
  border-radius: 9999px;
  border-width: 1px;
}
::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: rgba(128, 128, 128, 0.5);
}
</style>