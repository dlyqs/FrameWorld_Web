<template>
  <div class="msg-input-container flex-grow-1 d-flex">
    <v-textarea class="custom-textarea" ref="textArea" v-model="message" placeholder="在这里输入" :rows="rows" max-rows="8" :auto-grow="autoGrow"
                :disabled="disabled" :loading="loading" variant="solo" density="compact">
    </v-textarea>
    <v-btn class="custom-send-btn ml-3" :disabled="loading" icon="arrow_upward" rounded="lg" @click="send"></v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  sendMessage: Function,  // 发送消息的方法
  disabled: Boolean,      // 是否禁用输入
  loading: Boolean,       // 是否处于加载状态
});
const message = ref('');    // 绑定的消息文本
const rows = ref(1);        // 文本域的行数
const autoGrow = ref(true); // 是否自动增长

// 监听消息的变化，动态调整文本域的高度
watchEffect(() => {
  const lines = message.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines;
  autoGrow.value = lines <= 8;
});

// 发送消息
const send = () => {
  let msg = message.value.trim();
  if (msg) {
    props.sendMessage({ content: msg});
    message.value = ""; // 清空消息
  }
};

// 设置消息并聚焦文本域
const textArea = ref()
const usePrompt = (prompt) => {
  message.value = prompt
  textArea.value.focus()
}

// 暴露给父组件的方法
defineExpose({ usePrompt, send });
</script>

<style scoped>
.msg-input-container {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 5rem;
  align-content: center;
  justify-content: space-between;
}
.custom-textarea{
  height: 68px !important;
  border-radius:1rem;
}
.custom-send-btn {
  background-color: white !important;
  width: 44px;  /* 设置宽度和高度使按钮变成正方形 */
  height: 44px;
  margin-bottom: 6px;
}
</style>