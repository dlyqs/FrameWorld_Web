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