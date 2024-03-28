<script setup>
const props = defineProps({
  sendMessage: Function,
  disabled: Boolean,
  loading: Boolean,
});

const message = ref('');
const rows = ref(1);
const autoGrow = ref(true);

watchEffect(() => {
  const lines = message.value.split(/\r\n|\r|\n/).length;
  rows.value = lines > 8 ? 8 : lines;
  autoGrow.value = lines <= 8;
});

const sendPrompt = (prompt) => {
  usePrompt(prompt); // 先设置消息
  send(); // 然后发送
};


const send = () => {
  let msg = message.value.trim();
  if (msg) {
    let item = toolSelector.value.list[toolSelector.value.selected];
    props.sendMessage({ content: msg, tool: item.name, message_type: item.type});
    message.value = "";
    toolSelector.value.selected = 0;
  }
};

const textArea = ref()
const usePrompt = (prompt) => {
  message.value = prompt
  textArea.value.focus()
}

defineExpose({ usePrompt, send });

const clickSendBtn = () => {
  send()
}

const toolSelector = ref({
  list: [
    { title: "Chat", icon: "add", name: "chat", type: 0 },
  ],
  selected: 0,
})
</script>

<template>
  <div class="msg-input-container flex-grow-1 d-flex align-center justify-space-between">
    <v-textarea
        ref="textArea"
        v-model="message"
        :placeholder="('在这里输入')"
        :rows="rows"
        max-rows="8"
        :auto-grow="autoGrow"
        :disabled="disabled"
        :loading="loading"
        :hide-details="true"
        variant="solo"
        rounded="lg"
        density="compact"
        class="custom-textarea"
    ></v-textarea>
    <v-btn
        :disabled="loading"
        icon=""
        title="Send"
        class="custom-send-btn ml-3"
        color="white"
        rounded="lg"
        @click="clickSendBtn"
    ><v-icon>arrow_upward</v-icon></v-btn>
  </div>
</template>

<style scoped>
.msg-input-container {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 25px; /* 离底部距离 */
}

.custom-textarea{
  height: 48px;
}
.custom-send-btn {
  background-color: #ccc; /* 默认颜色为浅灰色 */
  width: 44px; /* 设置宽度和高度使按钮变成正方形 */
  height: 44px;
  margin-bottom: 3px;
}

</style>