<template>
  <div class="reply-item-top">
    <div class="reply-avatar" v-if="userInfo && userInfo.avatar_url" :style="{ backgroundImage: 'url(' + userInfo?.avatar_url + ')' }"></div>
    <div class="reply-content">
      <div class="reply-username">{{ username || 'Loading...' }}</div>
      <div class="reply-text">
        <template v-if="reply.parentID !== reply.replies">
          回复 @{{ replyUsername }}:
        </template>
        <span>{{ reply.content }}</span>
      </div>
    </div>
  </div>

  <div class="reply-item-bottom">
    <div class="bottom-left">
      <span class="reply-time">{{ displayTime(reply.time) }}</span>
      <v-btn class="reply-like" variant="text" @click="handleToggleLike">
        <template v-if="userHasLiked">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffcad4" width="20px" height="20px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffcad4" stroke-width="2" width="20px" height="20px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </template>
      </v-btn>
      <span class="reply-popularity">{{ localPopularity }}</span>
      <v-btn class="reply-reply" variant="text" @click="showReplyField = !showReplyField">回复</v-btn>
    </div>
    <div class="bottom-right">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="reply-action-btn" v-bind="props" color="grey" icon="more_horiz" variant="text"></v-btn>
        </template>
        <v-list class="reply-action-list">
          <v-list-item class="reply-action-item" title="Copy" prepend-icon="content_copy" @click="copyMessage"></v-list-item>
          <v-list-item class="reply-action-item" title="Delete" prepend-icon="delete" 
                       v-if="user.id === reply.user" @click="deleteCommentHandler"></v-list-item>
        </v-list>
      </v-menu>
      <v-snackbar v-model="snackbar" :timeout="1000">{{ snackbarText }}</v-snackbar>
    </div>
  </div>
  <div class="reply-add-reply" v-if="showReplyField">
    <textarea class="reply-reply-input" v-model="newReplyCommentContent" ref="textArea" placeholder="发表评论..." 
              :rows="rows" @input="handleInput" @focus="showActions = true" @blur="onBlur"></textarea>
    <div class="reply-actions" v-show="showActions">
      <v-btn class="reply-reply-submit" @click="submitComment">提交</v-btn>
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow, parseISO } from 'date-fns';
import copy from 'copy-to-clipboard';

const props = defineProps({
  reply: Object
});
const rows = ref(2);
const entryId = ref(1);                 // 假设当前条目ID，后期动态获取
const snackbarText = ref('');
const newReplyCommentContent = ref('');
const snackbar = ref(false);
const showActions = ref(false);
const showReplyField = ref(false);
const user = useUser();

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

// 调用获取用户、评论者名称
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

// 获取用户头像等信息
const { userInfo, error, fetchUserInfo } = useUserInfo();
onMounted(async () => {
  await fetchUserInfo(props.reply.user);
});

// 获取用户对点赞记录, 用户点赞操作
const localPopularity = ref(props.reply.popularity);
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

// 添加对评论的回复
const { addComment } = useAddComment();
const emit = defineEmits(['reply-added', 'update-total-comments', 'minus-total-comments', 'reply-deleted']);
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

// 删除回复
const { deleteComment } = useDeleteComment()
const deleteCommentHandler = async () => {
  const ok = await deleteComment(props.reply.id);
  if(ok){
    emit('minus-total-comments');
    emit('reply-deleted', props.reply.id);
  }
}
</script>

<style scoped>
.reply-item-top {
  display: flex;
  align-items: flex-start;
  gap: .8rem;
  margin-left: 1rem;
  margin-bottom: -0.4rem;
}
.reply-avatar {
  margin-top: 0.8rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}
.reply-text {
  white-space: pre-wrap; /* 保持空格和换行 */
}
.reply-content {
  margin-top: 0.6rem;
}

.reply-item-bottom{
  margin-left: 1.2rem;
  margin-top: -1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.reply-like{
  margin-top: -0.15rem;
}
.reply-popularity{
  margin-left: -1rem;
}
.reply-add-reply{
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}
.reply-reply-input {
  width: 100%; /* 确保输入框宽度适应容器 */
  padding: 8px 12px;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
  box-shadow: none;
  transition: background-color 0.3s, border-color 0.3s;
  resize: none; /* 禁用用户调整大小 */
}
.reply-reply-input:hover, .reply-reply-input:focus {
  background-color: #fff ;
}
.reply-reply-input:focus {
  border-color: #f0f0f0 !important;
  outline: none;
}
.reply-reply-submit {
  border: 1.5px solid #f89898;
  background-color: white !important;
  color: #f89898 !important;
  box-shadow: 2px 2px 0 #f89898;
  transition: all 0.3s ease;
  margin: 0 auto;
  font-size: 1.1rem;
  font-weight: bold;
}
.reply-reply-submit:hover {
  background-color: #f89898 !important;
  color: snow !important;
  box-shadow: none ;
}
.reply-action-btn{
  margin-right: .8rem;
  justify-items: flex-end;
}
.reply-action-list{
  margin: .5rem;
  border-radius: .8rem !important;
}
.reply-action-item{
  border-radius: .8rem !important;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  display: flex;
}
.reply-action-item:hover{
  background-color: rgba(0,0,0,0.04);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>