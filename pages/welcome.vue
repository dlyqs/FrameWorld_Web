<template>
  <v-container>
    <!-- 主页标题 -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <div class="text-h2">Welcome to
          <span class="text-gradient">{{ appName }}</span>
        </div>
      </v-col>
    </v-row>

    <!-- 对话组件 -->
    <v-row class="mt-5">
      <v-col>
        <Conversation :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Conversation from '~/components/Conversation/Conversation.vue';

const sourcePage = 'welcome';
const { public: { appName } } = useRuntimeConfig();

/*————————————————————————对话加载及路由跳转————————————————————————*/
const route  = useRoute();
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


const isLoading = ref(true); // 控制加载指示器的显示

async function handleConversationChange(conversationId) {
  try {
    isLoading.value = true;
    await loadConversation(conversationId); // 加载对话
    await loadMessage(conversationId); // 加载消息
    isLoading.value = false;
  } catch (error) {
    console.error('Failed to load data:', error);
    // 处理错误，例如显示一个错误消息
    isLoading.value = false;
  }
}
// 首次加载数据或处理逻辑
onMounted(() => {
  const conversationId = route.query.conversationId;
  if (conversationId) {
    handleConversationChange(conversationId);
  }
});

watch(() => route.query.conversationId, (newConversationId) => {
  if (newConversationId) {
    handleConversationChange(newConversationId);
  }
}, { immediate: true });
</script>

<style scoped>
.text-center{
  margin-top: 10rem;
}
.text-gradient {
  background-image: linear-gradient(to right, #fad0c4 0%, #ffd1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
</style>