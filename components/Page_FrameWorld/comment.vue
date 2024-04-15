<template>
  <v-container>
    <v-row class="comment-top">
      <v-col cols="auto">
        <span class="header-title">评论 ({{ totalComments }})</span>
      </v-col>
      <v-col cols="auto" class="sort-options">
        <span class="sort-option">最热</span> | <span class="sort-option">最新</span>
      </v-col>
    </v-row>

    <!-- 根评论输入区域 -->
    <v-row>
      <v-col cols="12">
        <textarea class="root-new-comment" ref="textArea" v-model="newCommentContent"
                  placeholder="发表评论..." :rows="rows" @input="handleInput" @focus="showActions = true"
                  @blur="onBlur"></textarea>
        <div v-show="showActions" class="comment-actions">
          <v-btn class="pink_btn" @click="addComment">提交</v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 根评论显示区域 -->
    <v-row>
      <v-col cols="12">
        <v-list three-line>
          <RootComment v-for="comment in paginatedRootComments" :key="comment.id" :comment="comment"
                       :indent-level="comment.parentID ? 1 : 0" @reply="prepareReply"/>
        </v-list>
        <v-pagination v-model="pagination.page" :length="Math.ceil(totalComments / rootCommentPageSize)" :total-visible="4"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import RootComment from './RootComment.vue';


const totalComments = ref(0);
const pagination = ref({ page: 1, itemsPerPage: 5 });


const rootComments = ref({ items: [], total: 0 });
const commentReplies = ref({});

const entryId = ref(1); // 假设当前条目ID，后期动态获取

const showActions = ref(false);  // 控制动作区显示

const newCommentContent = ref('');    // 绑定的消息文本
const rows = ref(2);        // 文本域的行数

const user = useUser(); // 使用useUser hook获取当前用户信息

const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines; // 限制最大行数为8

};
// 当输入区域失去焦点时延迟隐藏动作区
const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 300);  // 延迟300毫秒后隐藏
};
const addComment = async () => {
  if (!newCommentContent.value.trim()) {
    alert("评论内容不能为空！");
    return;
  }
  const commentData = {
    entry: entryId.value,
    time: new Date().toISOString(),
    content: newCommentContent.value,
    parentID: "",  // 根评论，所以parentID为空
    replies: "",   // 根评论，所以replies为空
    popularity: 0,
    user: user.value.id  // 假设useUser返回当前用户对象
  };

  try {
    const response = await useFetch('/api/frameworld/global_comments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      throw new Error('Failed to post comment');
    }

    const newComment = await response.json();
    rootComments.value.items.push(newComment);
    totalComments.value += 1;
    newCommentContent.value = ''; // 清空输入框
    alert('评论发布成功！');
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

const loadComments = async () => {
  // 只在客户端执行useFetch
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

// 使用watchEffect来确保每次entryId变化时，都会重新加载评论
watchEffect(() => {
  loadComments();
});

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
</script>

<style scoped>
.comment-top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
}
.header-title {
  font-size: 1.2rem;
  font-weight: bold;
}
.sort-options .sort-option {
  cursor: pointer;
  transition: color 0.3s;
  font-weight: bold;
}
.sort-options .sort-option:hover {
  color: pink;
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

</style>