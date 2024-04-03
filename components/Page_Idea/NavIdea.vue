<template>
  <v-container>
    <div class="content-wrapper">
      <!-- 标题 -->
      <v-row>
        <v-col>
          <div class="page-title">Step 1  : 想出一个好点子</div>
        </v-col>
      </v-row>

      <!-- 视频分区按钮 -->
      <v-row>
        <v-col cols="12">
          <div class="section-container">
            <div class="card-container">
              <div class="category-card" v-for="category in videoCategories" :key="category.name" :class="{ 'selected': isSelectedCategory(category.name) }" @click="toggleCategory(category.name)">
                <div class="card-image"><img :src="category.img" :alt="category.name"></div>
                <div class="card-title">{{ category.name }}</div>
              </div>
            </div>
          </div>
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

      <!-- 创意程度滑块 -->
      <v-row class="row-style">
        <v-col cols="14" class="column-style">
          <v-slider v-model="creativityLevel" :min="0" :max="100" step="1" class="slider-style" thumb-label>
            <template v-slot:prepend>
              <span class="slider-label">less creativity</span>
            </template>
            <template v-slot:append>
              <span class="slider-label">more creativity</span>
            </template>
          </v-slider>
        </v-col>
      </v-row>

      <!-- 参考的创作者输入框 -->
      <v-row class="row-style">
        <v-col cols="8">
          <v-text-field v-model="creativeConcept" label="参考创作者" placeholder="空间网址/UID/精确昵称" solo hide-details class="input-style"></v-text-field>
        </v-col>
      </v-row>

      <!-- 生成数量按钮组 -->
      <v-row class="row-style">
        <v-col cols="8">
          <span class="label-style">生成数量</span>
          <v-btn-toggle v-model="selectedGenerateCount" class="generate-count-toggle">
            <v-btn v-for="count in generateCounts" :key="count.value" :value="count.value" class="generate-count-btn">
              {{ count.text }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- 确认生成按钮 -->
      <v-row class="row-style">
        <v-col cols="8">
          <v-btn class="btn-generate" @click="onGenerateClick"><v-icon class="btn-generate-icon">directory_sync</v-icon>确认生成</v-btn>
        </v-col>
      </v-row>

      <!-- 对话模块 -->
      <v-row class="row-style">
        <v-col cols="25">
          <Conversation :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" class="conversation-style"/>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import Conversation from '~/components/Conversation/Conversation_idea.vue';

const sourcePage = 'idea';  //页面标识

/*————————————————————————提示词生成交互选项————————————————————————*/
// 分区选择
const selectedCategories = ref([])
const videoCategories = ref([
  { name: '动漫', img: 'https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f4d4.svg' },
  { name: '生活', img: 'https://em-content.zobj.net/thumbs/60/apple/391/camping_1f3d5-fe0f.webp' },
  { name: '科技', img: 'https://em-content.zobj.net/thumbs/60/apple/391/desktop-computer_1f5a5-fe0f.webp' },
  { name: '美食', img: 'https://em-content.zobj.net/thumbs/60/apple/391/french-fries_1f35f.webp' },
  { name: '影视', img: 'https://em-content.zobj.net/thumbs/60/apple/391/movie-camera_1f3a5.webp' },
  { name: '运动', img: 'https://em-content.zobj.net/thumbs/60/apple/391/soccer-ball_26bd.webp' },
  { name: '时尚', img: 'https://em-content.zobj.net/thumbs/60/apple/391/lipstick_1f484.webp' },
  { name: '音乐', img: 'https://em-content.zobj.net/thumbs/60/apple/391/headphone_1f3a7.webp' },
  { name: '汽车', img: 'https://em-content.zobj.net/thumbs/60/apple/391/racing-car_1f3ce-fe0f.webp' },
  { name: '游戏', img: 'https://em-content.zobj.net/thumbs/60/apple/391/video-game_1f3ae.webp' },
  { name: '知识', img: 'https://em-content.zobj.net/thumbs/60/apple/391/open-book_1f4d6.webp' },
  { name: '综艺', img: 'https://em-content.zobj.net/thumbs/60/apple/391/joker_1f0cf.webp' }
])

const toggleCategory = (categoryName) => {
  const index = selectedCategories.value.indexOf(categoryName)
  if (index !== -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryName)
  }
}
const isSelectedCategory = (categoryName) => {
  return selectedCategories.value.includes(categoryName)
}

// 视频长度类型
const selectedType = ref(null)
const videoTypes = ref(['短视频', '中视频', '长视频', '短剧'])

// 视频平台
const selectedPlatform = ref(null)
const platforms = ref(['全平台', 'b站', 'YouTube', '抖音', 'TikTok'])

// 视频参考
const creativeConcept = ref('')

// 创意程度
const creativityLevel = ref(50); // 初始化为50，代表"normal creativity"
const computedCreativityLevel = computed(() => {
  if (creativityLevel.value <= 40) {
    return 'less creativity';
  } else if (creativityLevel.value > 40 && creativityLevel.value <= 60) {
    return 'normal creativity';
  } else {
    return 'more creativity';
  }
});

// 生成数量
const selectedGenerateCount = ref('');
const generateCounts = [
  { value: '1', text: 'One' },
  { value: '3', text: 'Three' },
  { value: '10', text: 'Ten' }
];

// 生成提示语段（为了测试节省token这里先不写过多）
const generatedPrompts = computed(() => {
  if (!selectedCategories.value.length || !selectedType.value || !selectedPlatform.value || !selectedGenerateCount.value ) {
    return null
  }
  const creativityText = computedCreativityLevel.value;
  return `请给出和关键词：${selectedCategories.value.join('、')}，相关的一个简短描述。`
})

/*————————————————————————消息发送————————————————————————*/
const conversationComponent = ref(null);
const currentConversationId = ref('');

// 生成的提示词更新时，绑定为对话输入框的内容
watch(generatedPrompts, (newPrompt) => {
  if (conversationComponent.value) {
    conversationComponent.value.applyPrompt(newPrompt);
  }
});

// 确认生成按钮
const onGenerateClick = async () => {
  if (conversationComponent.value) {
    conversationComponent.value.clearMessages();  // 清空当前消息
    conversationComponent.value.triggerSend();    // 触发MsgEditor发送操作
    router.push({ path: `/${currentConversationId.value}`});
  }
};

/*————————————————————————对话加载及路由跳转————————————————————————*/
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
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
}
.section-container {
  text-align: center;
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
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
}
.card-container::before,
.card-container::after {
  content: '';
  position: absolute;
  height: 100%;
  top: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}
.category-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  border: 2px solid transparent; /* 默认边框颜色 */
}
.category-card.selected {
  background-color: #f0f0f0; /* 选中时的背景色 */
}
.category-card:hover {
  transform: translateY(-5px);
  border-color: #21ce99; /* 鼠标悬浮时的边框颜色 */
}
.card-image img {
  width: 26px;
  height: 26px;
  border-radius: 5px; /* 图片的圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
}
.row-style {
  margin-top: 25px; /* 每个行之间的间距 */
  display: flex;
  justify-content: center;
}

.column-style {
  padding: 20px; /* 列内边距用于分隔下拉框 */
}

/* 下拉框、输入框、文本框的基础样式 */
.select-style, .input-style {
  width: 100%; /* 宽度填满父容器 */
  border-radius: 4px; /* 圆角边框 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), /* 阴影效果 */
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out; /* 动效 */
}

/* 鼠标悬停时的动效和阴影变化 */
.select-style:hover, .input-style:hover, .textarea-style:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px); /* 简单的悬浮效果 */
}
.slider-style {
  /* 这里添加具体样式 */
  width: 100%; /* 宽度填满父容器 */
  border-radius: 4px; /* 圆角边框 */
  transition: box-shadow 0.3s ease-in-out; /* 动效 */
}
.slider-label {
  font-size: 1.5rem; /* 调整字体大小 */
  color: #666; /* 调整字体颜色 */
}
.generate-count-toggle {
  justify-content: center;
  display: flex;
}
.generate-count-btn {
  transition: all 0.3s ease;
  border: 2px solid #f89898; /* 边框颜色和宽度 */
}
.generate-count-btn.v-btn--active {
  background-color: #f89898; /* 选中时的背景色 */
  color: snow; /* 选中时的文字颜色 */
  border: 2px solid #f89898; /* 边框颜色和宽度 */
}
.label-style {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
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
