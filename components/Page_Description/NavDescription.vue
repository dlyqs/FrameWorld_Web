<template>
  <v-container>
    <div class="content-wrapper">
      <!-- 标题 -->
      <v-row>
        <v-col>
          <div class="page-title">Step 3  : 配上一段好文案</div>
        </v-col>
      </v-row>

      <!-- 切换按钮 -->
      <v-row class="row-style">
        <v-btn-toggle class="btn_toggle_mode" v-model="currentOption" mandatory>
          <v-btn class="btn_mode" v-for="option in optionsText" :key="option.value" :value="option.value">
            {{ option.text }}
          </v-btn>
        </v-btn-toggle>
      </v-row>

      <!-- 文本提示 -->
      <v-row class="row-style">
        <v-col>
          <v-card class="mx-auto" max-width="300" outlined elevation="2">
            <v-card-text>
              {{ optionText }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 对话模块 -->
      <v-row class="mt-5">
        <v-col>
          <Conversation :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import Conversation from '~/components/Conversation/Conversation.vue';

const sourcePage = 'description';

/*————————————————————————切换模式按钮————————————————————————*/
const currentOption = ref(0); // 选项的值应该对应optionsText中的value
const optionsText = [
  { text: '视频标题', value: 0 },
  { text: '封面图', value: 1 },
  { text: '视频简介', value: 2 },
];
const optionText = computed(() => {
  const selectedOption = optionsText.find(option => option.value === currentOption.value);
  return `已开启针对“${selectedOption.text}”的专属回答优化。`;
});

/*————————————————————————对话加载及路由跳转————————————————————————*/
const router = useRouter();
const conversationComponent = ref(null);
const conversation = ref(getDefaultConversationData());

async function loadConversation(id) {
  const { data, error } = await useAuthFetch(`/api/chat/conversations/${id}`);
  if (!error.value) {
    conversation.value = Object.assign(conversation.value, data.value);
  }
  return data.value.source_page
}

async function loadMessage(id) {
  const { data, error } = await useAuthFetch(`/api/chat/messages/?conversationId=${id}`);
  if (!error.value) {
    conversation.value.messages = data.value;
    conversation.value.id = id;
  }
}

// 使用Vue Router的beforeRouteUpdate守卫
onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.id !== from.params.id) {
    conversation.value.loadingMessages = true;
    const source_page = await loadConversation(to.params.id)
    if (source_page === sourcePage){
      await loadMessage(to.params.id);
      conversation.value.loadingMessages = false;
      await router.replace({path: '/', hash: `${sourcePage}`});
    }
    else {
      await router.replace({path: '/', hash: `${source_page}`});
      await router.replace({ path:`/${to.params.id}`});
    }
  }
  next();
});
</script>

<style scoped>
.content-wrapper {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}
.page-title {
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-size: 32px; /* 调整字体大小 */
  font-weight: bold; /* 加粗 */
  background-image: linear-gradient(to right, #212529 0%, #ced4da 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center; /* 文本居中 */
}
.row-style {
  margin-top: 50px; /* 每个行之间的间距 */
  display: flex;
  justify-content: center;
}
.btn_toggle_mode {
  justify-content: center;
  display: flex;
}
.btn_mode {
  transition: all 0.3s ease;
  border: 2px solid #f89898; /* 边框颜色和宽度 */
}
.btn_mode.v-btn--active {
  background-color: #f89898; /* 选中时的背景色 */
  color: snow; /* 选中时的文字颜色 */
}
</style>
