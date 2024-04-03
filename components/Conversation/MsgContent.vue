<template>
  <v-card rounded="lg" >
    <div ref="contentElm" v-html="contentHtml" class="chat-msg-content pa-5"></div>
  </v-card>
</template>

<script setup>
import MarkdownIt from 'markdown-it';
import copy from 'copy-to-clipboard';

const props = defineProps({
  message: Object, // 消息对象，包含要显示的文本等信息
  index: Number, // 消息索引，可用于优化渲染或定位
  usePrompt: Function, // 用于重用消息内容的函数
  deleteMessage: Function, // 删除消息的函数
});

// 初始化Markdown解析器，若需要添加插件则引入后.use来添加支持
const md = new MarkdownIt({ linkify: true })

// 创建响应式引用，用于绑定DOM元素
const contentHtml = ref('');
const contentElm = ref(null);

// 使用watchEffect监听props.message的变化，并更新渲染的HTML内容
watchEffect(async () => {
  contentHtml.value = props.message.message ? md.render(props.message.message) : '';
  await nextTick();
  bindCopyCodeToButtons();
});

// 绑定复制按钮的事件
const bindCopyCodeToButtons = () => {
  if(contentElm.value) {
    contentElm.value.onclick = () => {
      copy(props.message.message);
    }
  }
};

onMounted(bindCopyCodeToButtons);
</script>

<style scoped>
.chat-msg-content {
  font-size: 1rem !important;
  font-weight: 600;
  line-height: 2rem;
}
.chat-msg-content table {
  width: 100%;
  border-collapse: collapse;
  border-radius: .5rem;
}
.chat-msg-content table th,
.chat-msg-content table td {
  padding: .5rem 1rem;
  border: 1px solid gray;
}
.chat-msg-content ol, .chat-msg-content ul {
  padding-left: 2em;
}
</style>