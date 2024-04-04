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

      <!-- 视频类型和发布平台下拉框 -->
      <v-row class="row-style">
        <v-col cols="4" class="column-style">
          <v-select v-model="selectedType" :items="videoTypes" label="选择视频类型" solo hide-details class="select-style"></v-select>
        </v-col>
        <v-col cols="4" class="column-style">
          <v-select v-model="selectedPlatform" :items="platforms" label="选择视频发布平台" solo hide-details class="select-style"></v-select>
        </v-col>
      </v-row>

      <!-- 视频描述输入框 -->
      <v-row class="row-style">
        <v-col cols="8">
          <v-text-field v-model="videoDescription" label="视频描述" placeholder="视频关键词" solo hide-details class="input-style"></v-text-field>
        </v-col>
      </v-row>

      <!-- 确认生成按钮 -->
      <v-row class="row-style">
        <v-col cols="8">
          <v-btn class="btn-generate" @click="onGenerateClick"><v-icon class="btn-generate-icon">directory_sync</v-icon>确认生成</v-btn>
        </v-col>
      </v-row>

      <!-- 对话模块 -->
      <v-row class="mt-5">
        <v-col>
          <Conversation_description :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import Conversation_description from '~/components/Conversation/Conversation_description.vue';

const sourcePage = 'description';

/*————————————————————————提示词生成交互选项————————————————————————*/
// 视频长度类型
const selectedType = ref(null)
const videoTypes = ref(['短视频', '中视频', '长视频'])

// 视频平台
const selectedPlatform = ref(null)
const platforms = ref(['b站', 'YouTube', '抖音'])

// 视频描述
const videoDescription = ref('')


/*————————————————————————消息发送————————————————————————*/
const conversationComponent = ref(null);
const currentConversationId = ref('');
const isTriggered = ref(false);


// 确认生成按钮
const onGenerateClick = async () => {
  if (!selectedType.value || !selectedPlatform.value || !videoDescription.value) {
    // 可以加一些提示信息告诉用户需要填写完整信息
    return;
  }

  isTriggered.value = true; // 触发搜索

  async function fetchBilibiliData(videoDescription) {
    try {
      const response = await fetch(`/api/search/video_bili?q=${encodeURIComponent(videoDescription)}&max_page=1`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // 格式化数据
      return data.map(item => ({
        title: item.标题,
        uploadTime: item.上传时间,
        duration: item.视频时长,
        danmuCount: item.弹幕数,
        likeCount: item.点赞数,
        playCount: item.播放量,
        favoriteCount: item.收藏量,
        category: item.分区类型,
        tags: item.标签,
      }));
    } catch (error) {
      console.error("Fetching Bilibili search results failed:", error);
    }
  }

// 获取并格式化Bilibili数据
  const biliData = await fetchBilibiliData(videoDescription.value);
  const biliDataDescription = biliData.map(item => `标题：${item.title}，播放量：${item.playCount}，点赞数：${item.likeCount}，收藏量：${item.favoriteCount}，标签：${item.tags}`).join('\n');

  const currentOptionText = optionsText.find(option => option.value === currentOption.value)?.text || '';

  if (conversationComponent.value) {
    const newPrompt = `我现在需要为我的${selectedType.value}起一个新颖、能带来播放量的好${currentOptionText}，该视频会在${selectedPlatform.value}发布。我的视频的关键词和描述如下：${videoDescription.value}。
                       此外我还在${selectedPlatform.value}搜索了类似视频，并获取了部分搜索结果的标题、播放量等数据如下：\n${biliDataDescription}\n
                       请你在给出回答建议时除了利用你的创意外，也充分参考我给你的数据，这些数据包含了播放量等数据，因此你应该可以总结出高播放量的视频标题的特征或者方法。请将你分析这些数据后总结的方法经验用于回答给我的视频建议，
                       以此来给出比不给你数据参考时更好更贴切更能把握当下热点网络潮流的标题建议，记住参考完数据后给出的建议需要与你直接给出的有所不同。`;
    conversationComponent.value.applyPrompt(newPrompt);
    conversationComponent.value.triggerSend();    // 触发MsgEditor发送操作
    router.push({ path: `/${currentConversationId.value}`});
  }
};

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
const route = useRoute();
const router = useRouter();
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
.select-style, .input-style {
  width: 100%; /* 宽度填满父容器 */
  border-radius: 4px; /* 圆角边框 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), /* 阴影效果 */
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out; /* 动效 */
}
.select-style:hover, .input-style:hover, .textarea-style:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px); /* 简单的悬浮效果 */
}
.btn-generate {
  border: 1.5px solid #f89898; /* 设置边框为粉色 */
  background-color: white !important; /* 设置背景色为白色 */
  color: #f89898 !important; /* 设置文本颜色为粉色 */
  box-shadow: 2px 2px 0px #f89898; /* 设置右侧和下侧的窄阴影为粉色 */
  transition: all 0.3s ease; /* 过渡动画，让颜色变化更平滑 */
  font-size: 1.1rem;  /* 设置字体大小和粗细 */
  font-weight: bold;
  display: flex; /* 开启flex布局 */
  margin: auto; /* 自动外边距，进一步确保居中 */
}
.btn-generate:hover {
  background-color: #f89898 !important; /* 鼠标悬停时，背景变为粉色 */
  color: snow !important; /* 鼠标悬停时，文本颜色变为更深的粉色 */
  box-shadow: none ; /* 鼠标悬停时，移除阴影 */
}
.btn-generate-icon{
  justify-content: right;
  padding-right: 0.3rem;
}
</style>
