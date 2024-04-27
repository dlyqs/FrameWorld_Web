<template>
  <v-container>
    <div class="comment-top">
      <div class="comment-left">
        <span class="total-comments">评论 ({{ totalComments }})</span>
      </div>
      <div class="comment-right">
        <span class="sort-option" @click="sortByPopularity">最热</span> | <span class="sort-option" @click="sortByTime">最新</span>
      </div>
    </div>

    <div class="comment-add-new">
      <textarea class="comment-input" v-model="newCommentContent" ref="textArea" placeholder="发表评论..."
                :rows="rows" @input="handleInput" @focus="showActions = true" @blur="onBlur"></textarea>
      <v-btn class="comment-submit" @click="submitComment" v-show="showActions">提交</v-btn>
    </div>

    <div class="comment-show">
      <v-list three-line>
        <RootComment v-for="comment in paginatedRootComments" :key="comment.id" :comment="comment" :indent-level="comment.parentID ? 1 : 0"
                     @update-total-comments="totalComments += 1" @minus-total-comments="totalComments -= 1" @comment-deleted="handleCommentDeleted"/>
      </v-list>
      <v-pagination v-model="pagination.page" :length="Math.ceil(totalComments / pagination.itemsPerPage)" :total-visible="4"/>
    </div>
  </v-container>
</template>

<script setup>
import RootComment from './RootComment.vue';

const rows = ref(2);
const entryId = ref(1);     // 假设当前条目ID，后期动态获取
const totalComments = ref(0);
const commentReplies = ref({});
const pagination = ref({ page: 1, itemsPerPage: 5 });
const rootComments = ref({ items: [], total: 0 });
const newCommentContent = ref('');
const showActions = ref(false);
const user = useUser();

// 显示控制
const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines; // 限制最大行数为8
};
const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;  // 当输入区域失去焦点时延迟隐藏动作区
  }, 300);
};

// 添加根评论
const { addComment } = useAddComment();
const submitComment = async () => {
  const newComment = await addComment({
    entryId: entryId.value,
    content: newCommentContent.value,
    userID: user.value.id
  });
  if (newComment) {
    rootComments.value.items.push(newComment);
    totalComments.value += 1;
    newCommentContent.value = '';
  }
};

// 加载评论
const loadComments = async () => {
  if (process.client) {
    const response = await useFetch(`/api/frameworld/global_comments/?entry=${entryId}`, {
      method: 'GET',
      key: 'comments'
    });

    if (response.error.value) {
      console.error('Error fetching comments:', response.error.value);
    } else {
      const comments = response.data.value || [];
      rootComments.value.items = comments.filter(comment => !comment.parentID);
      totalComments.value = comments.length;
      commentReplies.value = comments.reduce((acc, comment) => {
        if (comment.parentID) {
          if (!acc[comment.parentID]) acc[comment.parentID] = [];
          acc[comment.parentID].push(comment);
        }
        return acc;
      }, {});
    }
  }
};
onMounted(loadComments);

// 使用watchEffect来确保变化重新加载评论
watchEffect(() => {
  loadComments();
});

// 计算分页后的根评论
const paginatedRootComments = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.itemsPerPage;
  const end = start + pagination.value.itemsPerPage;
  return rootComments.value.items
      .slice(start, end)
      .map(comment => ({
        ...comment,
        replies: commentReplies.value[comment.id] || []
      }));
});

// 处理根评论被删除
const handleCommentDeleted = (commentId) => {
  rootComments.value.items = rootComments.value.items.filter(c => c.id !== commentId);
};

// 按热度排序
const sortByPopularity = () => {
  rootComments.value.items.sort((a, b) => b.popularity - a.popularity);
};

// 按时间排序
const sortByTime = () => {
  rootComments.value.items.sort((a, b) => new Date(b.time) - new Date(a.time));
};
</script>

<style scoped>
.comment-top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-top: -1rem;
  padding: 1rem;
}
.total-comments {
  font-size: 1.2rem;
  font-weight: bold;
}
.comment-right .sort-option {
  cursor: pointer;
  transition: color 0.3s;
  font-weight: bold;
}
.comment-right .sort-option:hover {
  color: pink;
}
.comment-add-new{
   margin-top:-2rem;
   padding: 1rem 1rem 1rem 1rem;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
 }
.comment-input {
  width: 100%; /* 确保输入框宽度适应容器 */
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
  font-size: 1.1rem;  /* 设置字体大小和粗细 */
  font-weight: bold;
  margin-top: 1rem;
}
.comment-submit:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none ; /* 鼠标悬停时，移除阴影 */
}
</style>