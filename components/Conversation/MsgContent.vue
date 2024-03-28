<script setup>
import MarkdownIt from 'markdown-it';
import copy from 'copy-to-clipboard';
import mathjax3 from 'markdown-it-mathjax3';

// 初始化Markdown解析器，并添加MathJax支持
const md = new MarkdownIt({ linkify: true }).use(mathjax3);

const props = defineProps({
  message: Object,
  index: Number,
  usePrompt: Function,
  deleteMessage: Function,
});

const contentHtml = ref('');

// 创建响应式引用，用于绑定DOM元素
const contentElm = ref(null);

// 使用watchEffect监听props.message的变化，并更新渲染的HTML内容
watchEffect(async () => {
  contentHtml.value = props.message.message ? md.render(props.message.message) : '';
  await nextTick();
  bindCopyCodeToButtons();
});

// 绑定复制按钮的事件
const bindCopyCodeToButtons = () => {
  const codeContainers = contentElm.value?.querySelectorAll('.hljs-code-container') ?? [];
  codeContainers.forEach((codeContainer) => {
    const copyButton = codeContainer.querySelector('.hljs-copy-button');
    const codeBody = codeContainer.querySelector('code');
    copyButton.onclick = () => {
      copy(codeBody.textContent ?? '');
      copyButton.textContent = "Copied!";
      setTimeout(() => copyButton.textContent = "Copy", 2000);
    };
  });
};

onMounted(bindCopyCodeToButtons);
</script>

<template>
  <v-card rounded="lg" :class="{ 'card_disabled': message.is_disabled } ">
    <div ref="contentElm" v-html="contentHtml" class="chat-msg-content pa-3"></div>
  </v-card>
</template>

<style>
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