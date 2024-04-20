<template>
  <div class="reply-item">
    <div class="avatar" :style="{ backgroundImage: 'url(' + userInfo?.avatar_url + ')' }"></div>
    <div class="reply-content">
      <div class="reply-title">{{ username || 'Loading...' }}</div>
      <div class="reply-subtitle">
        <template v-if="reply.parentID !== reply.replies">
          回复 @{{ replyUsername }}: {{ reply.content }}
        </template>
        <template v-else>
          {{ reply.content }}
        </template>
      </div>
    </div>
  </div>
  <!-- 信息操作区 -->
  <div class="comment-info">
    <!-- 左侧元素 -->
    <div class="left-items">
      <!-- 时间显示 -->
      <span>{{ displayTime(reply.time) }}</span>

      <!-- 点赞按钮和点赞数 -->
      <v-btn variant="text" @click="handleToggleLike">
        <!-- 条件渲染不同的图标 -->
        <template v-if="userHasLiked">
          <!-- 实心爱心 -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffcad4" width="20px" height="20px">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </template>
        <template v-else>
          <!-- 空心爱心 -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffcad4" stroke-width="2" width="20px" height="20px">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </template>
      </v-btn>
      <span>{{ localPopularity }}</span>

      <!-- 回复按钮 -->
      <v-btn variant="text" small @click="showReplyField = !showReplyField">回复</v-btn>
    </div>

    <!-- 右侧元素 -->
    <div class="right-items">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="btn_more" v-bind="props" color="grey" icon="more_horiz" variant="text"></v-btn>
        </template>
        <v-list class="list_more">
          <v-list-item class="list_item_more" @click="copyMessage" title="Copy" prepend-icon="content_copy"></v-list-item>
          <!-- 条件显示删除按钮 -->
          <v-list-item v-if="user.id === reply.user" @click="deleteCommentHandler" title="Delete" prepend-icon="delete"></v-list-item>
        </v-list>
      </v-menu>
      <v-snackbar v-model="snackbar" :timeout="2000">
        {{ snackbarText }}
      </v-snackbar>
    </div>
  </div>
  <div v-if="showReplyField" class="reply-field">
    <textarea class="root-new-comment" ref="textArea" v-model="newReplyCommentContent"
              placeholder="发表评论..." :rows="rows" @input="handleInput" @focus="showActions = true"
              @blur="onBlur"></textarea>
    <div v-show="showActions" class="comment-actions">
      <v-btn class="pink_btn" @click="submitComment">提交</v-btn>
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow, parseISO } from 'date-fns';
import copy from 'copy-to-clipboard';

const newReplyCommentContent = ref('');    // 绑定的消息文本
const rows = ref(2);        // 文本域的行数
const showActions = ref(false);  // 控制动作区显示
const user = useUser(); // 使用useUser hook获取当前用户信息
const entryId = ref(1); // 假设当前条目ID，后期动态获取
const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines; // 限制最大行数为8

};
// 当输入区域失去焦点时延迟隐藏动作区
const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 1000);  // 延迟300毫秒后隐藏
};
// 添加对根评论的回复
const { addComment } = useAddComment();
const emit = defineEmits(['reply-added', 'update-total-comments']);
const submitComment = async () => {
  const newReply = await addComment({
    entryId: entryId.value,
    content: newReplyCommentContent.value,
    parentID: props.reply.parentID,
    replies: props.reply.id,
    userID: user.value.id
  });

  if (newReply) {
    emit('reply-added', newReply);
    emit('update-total-comments');
    newReplyCommentContent.value = '';
  }
};

const showReplyField = ref(false);
const replyContent = ref('');
const props = defineProps({
  reply: Object
});
const snackbar = ref(false);
const snackbarText = ref('');
// 动态显示评论时间
const displayTime = (time) => {
  const now = new Date();
  const commentTime = parseISO(time);
  return formatDistanceToNow(commentTime, {addSuffix: true});
};

// 复制消息内容并显示提示
const copyMessage = () => {
  copy(props.reply.content);
  snackbarText.value = 'Copied!';
  snackbar.value = true;
};

// 调用获取用户、评论者名称

const replyUsername = ref('');
const username = ref('');
const { fetchUsername } = useFetchUsername();


//获取回复对象的id
const fetchReplyComment = async (replyId) => {
  if (replyId) {
    const { data, error } = await useFetch(`/api/frameworld/global_comments/?id=${replyId}`);
    if (!error.value && data.value && data.value.length > 0) {
      fetchUsername(data.value[0].user, (name) => {
        replyUsername.value = name;
      });
    } else {
      console.error('Failed to fetch reply comment:', error.value);
    }
  }
};

watchEffect(() => {
  if (props.reply && props.reply.user) {
    fetchUsername(props.reply.user, (name) => {
      username.value = name;
    });
  }
});

watchEffect(() => {
  if (props.reply.parentID !== props.reply.replies) {
    fetchReplyComment(props.reply.replies);
  }
});

// comment-info区域
const localPopularity = ref(props.reply.popularity);

const { userInfo, error, fetchUserInfo } = useUserInfo();

onMounted(async () => {
  await fetchUserInfo(props.reply.user);
});

// 获取用户对点赞记录、及点赞操作
const { userHasLiked, fetchLikeStatus, toggleLike } = useCommentLike(props.reply.id, user.value.id, localPopularity);

onMounted(async ()=> {
  if (props.reply && props.reply.id) {
    fetchLikeStatus();
  }
});

const handleToggleLike = async () => {
  toggleLike();
  const delta = userHasLiked.value ? -1 : 1;
  localPopularity.value += delta;
};

const { deleteComment } = useDeleteComment()

const deleteCommentHandler = () => {
  deleteComment(props.reply.id)
}
</script>

<style scoped>
.reply-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-left: 1rem;
}

.avatar {
  margin-top: 0.8rem;
  width: 32px;  /* 设置头像宽度 */
  height: 32px;  /* 设置头像高度 */
  border-radius: 50%;  /* 圆形头像 */
  background-position: center;  /* 确保背景图片居中显示 */
  background-size: cover;  /* cover 确保图片完全覆盖容器区域，同时保持图片的长宽比 */
  background-repeat: no-repeat;  /* 防止背景图片重复 */
  overflow: hidden;  /* 隐藏容器外的背景图部分 */
  border: 2px solid #fff;  /* 可选：为头像添加边框 */
}

.reply-content {
  flex: 1;
  margin-top: 0.6rem;
}

.reply-title, .reply-subtitle {
  margin: 0;
}
.btn_more{
  margin: .5rem;
  justify-items: flex-end;
}
.list_more{
  margin: .5rem;
  border-radius: 1rem !important;
}
.list_item_more{
  margin: 5px;
}
.list_item_more:hover{
  border-radius: 1rem;
}
.comment-info{
  margin-left: 1.2rem;
  margin-top: -1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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