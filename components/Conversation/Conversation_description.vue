<template>
  <div v-if="conversation">
    <div v-if="conversation.loadingMessages" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <!-- 消息展示区 -->
      <div v-if="conversation.messages" ref="chatWindow">
        <v-container class="conversation_container">
          <v-row>
            <!-- 修改这部分来仅显示最后一条机器消息 -->
            <v-col cols="12">
              <div class="d-flex align-center justify-start conversation_container">
                <!-- 使用lastBotMessage代替循环 -->
                <MsgContent v-if="lastBotMessage" :message="lastBotMessage"/>
                <MessageActions v-if="lastBotMessage" :message="lastBotMessage" :use-prompt="usePrompt" :delete-message="deleteMessage"/>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <!-- 占位符，用于消息滚动 -->
        <div ref="grab" class="w-100" style="height: 200px;"></div>
      </div>
    </div>
  </div>

  <!-- 输入区 -->
  <v-footer app class="footer">
    <div class="px-md-16 w-100 d-flex flex-column">
      <div class="d-flex align-center">
        <MsgEditor ref="editor" :send-message="send" :disabled="fetchingResponse" :loading="fetchingResponse" class="hidden-editor"/>
      </div>
    </div>
  </v-footer>

  <!-- 通知栏 -->
  <v-snackbar v-model="snackbar" multi-line location="top">{{ snackbarText }}
    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import MsgContent from "./MsgContent.vue";
import MsgEditor from "./MsgEditor.vue";
import MessageActions from "./MessageActions.vue";
import {EventStreamContentType, fetchEventSource} from '@microsoft/fetch-event-source'

const fetchingResponse = ref(false)
const props = defineProps({
  conversation: Object,
  sourcePage: String
})

/*————————————————————————消息队列————————————————————————*/
let isProcessingQueue = false
const messageQueue = []
const processMessageQueue = () => {
  if (isProcessingQueue || messageQueue.length === 0) {
    return
  }
  // 确保会话的最后一条消息为机器人消息，如果不是，则添加一条空的机器人消息
  if (!props.conversation.messages[props.conversation.messages.length - 1].is_bot) {
    props.conversation.messages.push({id: null, is_bot: true, message: ''})
  }
  isProcessingQueue = true    // 标记开始处理消息队列

  // 从消息队列中取出下一条消息
  const nextMessage = messageQueue.shift()
  // 将取出的消息添加到会话的最后一条机器人消息中
  props.conversation.messages[props.conversation.messages.length - 1].message += nextMessage

  isProcessingQueue = false   // 标记消息队列处理完成
  // 递归处理，以便连续处理队列中的下一条消息
  processMessageQueue()
}

/*————————————————————————fetch请求————————————————————————*/
const openaiApiKey = useApiKey()
const frugalMode = ref(false)
let ctrl  // 用于管理fetch请求的AbortController实例

// 如果存在控制器实例，中止fetch请求并重置响应状态
const abortFetch = () => {
  if (ctrl) {
    ctrl.abort();
  }
  fetchingResponse.value = false;
};

// 异步函数，用于从后端获取回复
const fetchReply = async (message) => {
  ctrl = new AbortController()

  // 确保message总是一个数组，以统一处理逻辑
  message = [message]

  // 准备请求数据
  const data = {
    openaiApiKey: openaiApiKey.value,
    message: message,
    conversationId: props.conversation.id,
    frugalMode: frugalMode.value, // 节俭模式，默认false记忆上下文
  };

  try {
    await fetchEventSource('/api/conversation/', {
      signal: ctrl.signal,  // 传递abort信号以支持取消请求
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // 将数据序列化为JSON字符串
      openWhenHidden: true, // 即使页面隐藏也打开连接
      onopen(response) {
        // 检查响应状态，确保连接正常打开
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) { return; }
        throw new Error(`Failed to send message. HTTP ${response.status} - ${response.statusText}`);
      },
      onclose() {
        if (ctrl.signal.aborted === true) { return; }
        throw new Error(`Failed to send message. Server closed the connection unexpectedly.`);
      },
      onerror(err) { throw err; },

      async onmessage(message) {
        // 处理从服务器接收到的消息事件
        const event = message.event
        const data = JSON.parse(message.data)

        if (event === 'error') {
          abortFetch()
          showSnackbar(data.error)
          return;
        }
        if (event === 'userMessageId') {
          props.conversation.messages[props.conversation.messages.length - 1].id = data.userMessageId
          return;
        }
        if (event === 'done') {
          abortFetch()
          props.conversation.messages[props.conversation.messages.length - 1].id = data.messageId
          if (!props.conversation.id) {
            props.conversation.id = data.conversationId
            await genTitle(props.conversation.id, props.sourcePage)
          }
          return;
        }
        // 将新消息内容添加到消息队列并处理
        messageQueue.push(data.content)
        processMessageQueue()
        scrollChatWindow()
      },
    })
  } catch (err) {
    // 捕获并处理请求过程中的异常并提示
    console.log(err)
    abortFetch()
    showSnackbar(err.message)
  }
}

/*————————————————————————功能函数————————————————————————*/
// 抓取用于触发滚动到最新消息的元素
const grab = ref(null)
// 滚动聊天窗口至最新消息处
const scrollChatWindow = () => {
  if (grab.value === null) { return; }
  grab.value.scrollIntoView({behavior: 'smooth'})
}

// 发送消息
const send = (message) => {
  fetchingResponse.value = true // 标记开始获取响应
  // 如果当前没有对话，则创建一个新对话
  if (props.conversation.messages.length === 0) {
    addConversation(props.conversation)
  }
  // 根据message是单个消息还是消息数组来处理
  if (Array.isArray(message)) {
    // 批量添加消息
    props.conversation.messages.push(...message.map(i => ({message: i.content, message_type: i.message_type})))
  } else {
    // 添加单个消息
    props.conversation.messages.push({ message: message.content, message_type: message.message_type })
  }
  fetchReply(message) // 请求回复
  scrollChatWindow()
}

// 停止获取响应，后续可添加按钮
const stop = () => {
  abortFetch()
}

// 提示栏
const snackbar = ref(false)
const snackbarText = ref('')
const showSnackbar = (text) => {
  snackbarText.value = text
  snackbar.value = true
}

// 删除特定索引的消息
const deleteMessage = (index) => {
  props.conversation.messages.splice(index, 1)
}

// 切换特定索引消息的禁用状态
const toggleMessage = (index) => {
  props.conversation.messages[index].is_disabled = !props.conversation.messages[index].is_disabled
}

// 清空消息显示,但又不触发新对话的创建逻辑
const clearMessages = () => {
  props.conversation.messages = [''];
};

// 添加计算属性来获取最后一条机器的消息
const lastBotMessage = computed(() => {
  // 每条消息都有一个is_bot标识和created_at时间戳.过滤出机器的消息，并根据created_at进行排序，取最新的一条
  const botMessages = props.conversation.messages.filter(msg => msg.is_bot);
  return botMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
});

/*————————————————————————与子组件MsgEditor通信————————————————————————*/
const editor = ref(null)
const applyPrompt = (prompt) => {
  if (editor.value) {
    editor.value.usePrompt(prompt);
  }
};

// 触发MsgEditor发送操作
const triggerSend = () => {
  if (editor.value) {
    editor.value.send();
  }
};
// 暴露方法，以便父组件调用
defineExpose({ applyPrompt, triggerSend});
</script>

<style scoped>
.conversation_container{
  margin-left: 2rem;
}
.hidden-editor {
  visibility: hidden;
  height: 0;
  overflow: hidden;
}
</style>