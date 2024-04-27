<template>
  <div class="comment-item-top">
    <div class="comment-avatar" v-if="userInfo && userInfo.avatar_url" :style="{ backgroundImage: 'url(' + userInfo?.avatar_url + ')' }"></div>
    <div class="comment-content">
      <div class="comment-username">{{ username || 'Loading...' }}</div>
      <div class="comment-text">
        <template v-if="comment.replies">
          回复 @{{ replyUsername }}:
        </template>
        <span>{{ comment.content }}</span>
      </div>
    </div>
  </div>
  
  <div class="comment-item-bottom">
    <div class="bottom-left">
      <span class="comment-time">{{ displayTime(comment.time) }}</span>
      <v-btn class="comment-like" variant="text" @click="handleToggleLike">
        <template v-if="userHasLiked">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffcad4" width="20px" height="20px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffcad4" stroke-width="2" width="20px" height="20px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </template>
      </v-btn>
      <span class="comment-popularity">{{ localPopularity }}</span>
      <v-btn class="comment-reply" variant="text" @click="showReplyField = !showReplyField">回复</v-btn>
    </div>
    <div class="bottom-right">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="comment-action-btn" v-bind="props" color="grey" icon="more_horiz" variant="text"></v-btn>
        </template>
        <v-list class="comment-action-list">
          <v-list-item class="comment-action-item" title="Copy" prepend-icon="content_copy" @click="copyMessage"></v-list-item>
          <v-list-item class="comment-action-item" title="Delete" prepend-icon="delete" 
                       v-if="user.id === comment.user" @click="deleteCommentHandler"></v-list-item>
        </v-list>
      </v-menu>
      <v-snackbar v-model="snackbar" :timeout="1000">{{ snackbarText }}</v-snackbar>
    </div>
  </div>
  
  <div class="comment-add-reply" v-if="showReplyField">
    <textarea class="comment-reply-input" v-model="newRootCommentContent" ref="textArea" placeholder="回复该评论..."
              :rows="rows" @input="handleInput" @focus="showActions = true" @blur="onBlur"></textarea>
    <div class="comment-actions" v-show="showActions" >
      <v-btn class="comment-reply-submit" @click="submitComment">提交</v-btn>
    </div>
  </div>
</template>

<script setup>
import copy from 'copy-to-clipboard';
import { formatDistanceToNow, parseISO } from 'date-fns';

const props = defineProps({
  comment: Object,
  currentTimestamp: Number,
});
const rows = ref(2);                    // 文本域的行数
const entryId = ref(1);                 // 假设当前条目ID，后期动态获取
const snackbarText = ref('');
const newRootCommentContent = ref('');  // 绑定的消息文本
const snackbar = ref(false);
const showActions = ref(false);         // 控制动作区显示
const showReplyField = ref(false);
const user = useUser();                 // 使用useUser hook获取当前用户信息
const emit = defineEmits(['update-total-comments', 'comment-deleted','reply-added']);

// 输入区域效果控制
const handleInput = (event) => {
  const lines = event.target.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines;
};

const onBlur = () => {
  setTimeout(() => {
    showActions.value = false;
  }, 500);
};

// 动态显示评论时间
const displayTime = (time) => {
  new Date();
  const commentTime = parseISO(time);
  return formatDistanceToNow(commentTime, {addSuffix: true});
};

// 复制消息内容并显示提示
const copyMessage = () => {
  copy(props.comment.content);
  snackbarText.value = 'Copied!';
  snackbar.value = true;
};

// 获取用户及回复对象名称
const username = ref('');
const replyUsername = ref('');
const { fetchUsername } = useFetchUsername();
const fetchReplyComment = async (replyId) => {
  if (replyId) {
    const { data, error } = await useFetch(`/api/frameworld/global_comments/?id=${replyId}`);//获取回复对象的id
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
  if (props.comment && props.comment.user) {
    fetchUsername(props.comment.user, (name) => {
      username.value = name;
    });
    if (props.comment.replies) {
      fetchReplyComment(props.comment.replies);
    }
  }
});

// 获取用户头像等信息
const { userInfo, error, fetchUserInfo } = useUserInfo();
onMounted(async () => {
  await fetchUserInfo(props.comment.user);
});

// 获取用户点赞记录, 用户点赞操作
const localPopularity = ref(props.comment.popularity);
const { userHasLiked, fetchLikeStatus, toggleLike } = useCommentLike(props.comment.id, user.value.id, localPopularity,true);
onMounted(async ()=> {
  if (props.comment && props.comment.id) {
    fetchLikeStatus();
  }
});

const handleToggleLike = async () => {
  toggleLike();
  const delta = userHasLiked.value ? -1 : 1;
  localPopularity.value += delta;
};

// 添加对评论的回复
const { addComment } = useAddComment(true);
const submitComment = async () => {
  const newComment = await addComment({
    entryId: entryId.value,
    content: newRootCommentContent.value,
    replies: props.comment.id,
    userID: user.value.id,
    timestamp: props.currentTimestamp
  });
  if (newComment) {
    emit('reply-added', newComment);
    emit('update-total-comments');
    newRootCommentContent.value = '';
  }
};

// 删除评论
const { deleteComment } = useDeleteComment(true)
const deleteCommentHandler = async () => {
  const ok = await deleteComment(props.comment.id);
  if(ok){
    emit('comment-deleted', props.comment.id);
  }
}
</script>

<style scoped>
.comment-item-top {
  display: flex;
  align-items: flex-start;
  gap: .8rem;
  margin-bottom: .5rem;
  margin-top: .6rem;
}
.comment-avatar {
  margin-left: .3rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-position: center;  /* 确保背景图片居中显示 */
  background-size: cover;       /* 确保图片完全覆盖容器区域，同时保持图片的长宽比 */
  background-repeat: no-repeat;
  overflow: hidden;
}
.comment-text {
  white-space: pre-wrap; /* 保持空格和换行 */
}

.comment-item-bottom{
  margin-left: 0.6rem;
  margin-top: -0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.comment-like{
  margin-top: -0.15rem;
}
.comment-popularity{
  margin-left: -1rem;
}
.comment-reply-input {
  width: 100%; /* 确保输入框宽度适应容器 */
  padding: 8px 12px;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
  box-shadow: none;
  transition: background-color 0.3s, border-color 0.3s;
  resize: none; /* 禁用用户调整大小 */
}
.comment-reply-input:hover, .comment-reply-input:focus {
  background-color: #fff ;
}
.comment-reply-input:focus {
  border-color: #f0f0f0 !important;
  outline: none;
}
.comment-reply-submit {
  border: 1.5px solid #f89898;
  background-color: white !important;
  color: #f89898 !important;
  box-shadow: 2px 2px 0 #f89898;
  transition: all 0.3s ease;
  margin: 0 auto;
  font-size: 1.1rem;
  font-weight: bold;
}
.comment-reply-submit:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none ; /* 鼠标悬停时，移除阴影 */
}
.comment-action-list{
  margin: .5rem;
  border-radius: .8rem !important;
}
.comment-action-item {
  border-radius: .8rem !important;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  display: flex;
}
.comment-action-item:hover {
  background-color: rgba(0,0,0,0.04);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>