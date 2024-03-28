<template>
  <v-container>
    <div class="content-wrapper">
      <!-- 视频分区的按钮 -->
      <v-row>
        <v-col cols="12">
          <div class="section-container">
            <h2 class="section-title">开始，想出一个好的点子</h2>
            <div class="card-container">
              <div v-for="category in videoCategories" :key="category.name"
                   class="category-card"
                   :class="{ 'selected': isSelectedCategory(category.name) }"
                   @click="toggleCategory(category.name)">
                <div class="card-image">
                  <img :src="category.img" :alt="category.name">
                </div>
                <div class="card-title">{{ category.name }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <!-- 视频类型和发布平台的下拉框 -->
      <v-row class="row-style">
        <v-col cols="4" class="column-style">
          <v-select v-model="selectedType" :items="videoTypes" label="选择视频类型" solo class="select-style"></v-select>
        </v-col>
        <v-col cols="4" class="column-style">
          <v-select v-model="selectedPlatform" :items="platforms" label="选择视频发布平台" solo class="select-style"></v-select>
        </v-col>
      </v-row>
      <!-- 创意程度的滑块 -->
      <v-row class="row-style">
        <v-col cols="14" class="column-style">
          <v-slider v-model="creativityLevel" :min="0" :max="100" step="1" class="slider-style">
            <template v-slot:prepend>
              <span class="slider-label">less creativity</span>
            </template>
            <template v-slot:append>
              <span class="slider-label">more creativity</span>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <!-- 输入参考视频的创作分类和风格的输入框 -->
      <v-row class="row-style">
        <v-col cols="8">
          <v-text-field v-model="creativeConcept" label="参考创作者" placeholder="空间网址/UID/精确昵称" solo class="input-style"></v-text-field>
        </v-col>
      </v-row>
      <!-- 生成数量的按钮组 -->
      <v-row class="row-style">
        <v-col cols="8">
          <span class="label-style">生成数量 (双击确认) </span>
          <v-btn-toggle v-model="selectedGenerateCount" class="generate-count-toggle">
            <v-btn v-for="count in generateCounts" :key="count.value" :value="count.value" class="generate-count-btn" @click="onGenerateClick">
              {{ count.text }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <!-- 对话组件 -->
      <v-row class="row-style">
        <v-col cols="25">
          <Conversation :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" class="conversation-style"/>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import Conversation from '~/components/Conversation/Conversation_idea.vue'; // 确保路径正确
import { useRoute, useRouter } from 'vue-router';
// 假设以下是与Conversation组件相关的数据和方法
const route = useRoute();
const router = useRouter();
const conversation = ref(getDefaultConversationData()); // 假设这是获取默认对话数据的方法

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
const videoTypes = ref(['短视频', '中视频', '长视频', '短剧'])
const platforms = ref(['全平台', 'b站', 'YouTube', '抖音', 'TikTok'])
const selectedCategories = ref([])
const selectedType = ref(null)
const selectedPlatform = ref(null)
const creativeConcept = ref('')
const runtimeConfig = useRuntimeConfig()
const creativityLevel = ref(50); // 初始化为50，代表"normal creativity"

const computedCreativityLevel = computed(() => {
  // 根据滑块位置判断创意等级
  if (creativityLevel.value <= 40) {
    return 'less creativity'; // 小于等于40为"less creativity"
  } else if (creativityLevel.value > 40 && creativityLevel.value <= 60) {
    return 'normal creativity'; // 介于40到60之间为"normal creativity"
  } else {
    return 'more creativity'; // 大于60为"more creativity"
  }
});
const selectedGenerateCount = ref('');
const generateCounts = [
  { value: '1', text: 'One' },
  { value: '3', text: 'Three' },
  { value: '10', text: 'Ten' }
];

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

const generatedPrompts = computed(() => {
  if (!selectedCategories.value.length || !selectedType.value || !selectedPlatform.value || !selectedGenerateCount.value ) {
    return null
  }
  const creativityText = computedCreativityLevel.value;
  return `我是一名视频创作者，现在想创作一个${selectedType.value}，初步考虑的分区是（${selectedCategories.value.join('、')}），主要会在${selectedPlatform.value}发布。我希望你给出的视频创意点子是"${creativityText}"的，请你只需要生成${selectedGenerateCount.value}个参考意见（精确这个回答数，不能多不能少）,意见需要十分详细，除了笼统的意见外还跟一个实际操作案例在后面。对于你的回答，有以下严格的样式要求：1、你不要多说任何一句话，开门见山仅生成你提供的回答。2、如果前文说让你给出1个建议，那你就只要回答这个建议本身，回答完即结束，如果让你生成1个以上的建议，你就分点列出建议，切忌除了回答之外不要有其它任何语句。3、回答的最开始是空的一行，换行后再开始回答。`
})


const conversationComponent = ref(null);

// 监听generatedPrompts的变化
watch(generatedPrompts, (newPrompt) => {
  // 当generatedPrompts更新时，调用Conversation的applyPrompt方法
  if (conversationComponent.value) {
    conversationComponent.value.applyPrompt(newPrompt);
  }
});

const currentConversationId = ref('');

// 生成数量按钮点击事件处理函数
const onGenerateClick = () => {
  // 触发Conversation组件中的MsgEditor发送操作
  if (conversationComponent.value) {
    conversationComponent.value.clearMessages();
    conversationComponent.value.triggerSend();
    router.push({ path: '/', hash: 'idea'});
    router.push({ path: `/${currentConversationId.value}`});
  }
};

//页面标识
const sourcePage = 'idea';

// 修改loadConversation函数以获取sourcePage信息
const loadConversation = async () => {
  const { data, error } = await useAuthFetch(`/api/chat/conversations/${route.params.id}`);
  if (!error.value) {
    conversation.value = Object.assign(conversation.value, data.value);
    // 假设返回的数据中包含sourcePage
    return data.value.source_page; // 返回对话所属的sourcePage
  }
  return null;
};

const loadMessage = async () => {
  const { data, error } = await useAuthFetch(`/api/chat/messages/?conversationId=${route.params.id}`);
  if (!error.value) {
    conversation.value.messages = data.value;
    conversation.value.id = route.params.id;
  }
};

// 监听路由参数的变化
watch(() => route.params.id, async (newId) => {
  if (newId) {
    currentConversationId.value = newId;
    conversation.value.loadingMessages = true;
    const conversationSourcePage = await loadConversation();
    if (conversationSourcePage === sourcePage) {
      // 当前页面的sourcePage与对话的sourcePage匹配
      await loadMessage();
      conversation.value.loadingMessages = false;
      // 保持在当前页面，但更新路由以反映新的对话ID
      await router.push({ path: '/', hash: 'idea'});
    } else {
      // 如果不匹配，可能需要执行一些操作，比如跳转到正确的页面或显示一条消息
      console.log(`对话属于其他页面: ${conversationSourcePage}`);
      // 例如，跳转到对话实际属于的页面
      // await router.push({ path: `/${conversationSourcePage}/${newId}` });
      conversation.value.loadingMessages = false;
    }
  }
}, { immediate: true });
</script>

<style>
.content-wrapper {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
}
.section-container {
  text-align: center;
}
.section-title {
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-size: 32px; /* 调整字体大小 */
  font-weight: bold; /* 加粗 */
  font-family: "Times New Roman", Times, serif; /* 使用更高级的字体 */
  color: #333; /* 字体颜色 */
  text-align: center; /* 文本居中 */
  text-transform: uppercase; /* 转换为大写字母 */
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
.select-style, .input-style, .textarea-style {
  width: 100%; /* 宽度填满父容器 */
  border-radius: 4px; /* 圆角边框 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), /* 阴影效果 */
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out; /* 动效 */
  border-bottom: none;
}

.v-input__details {
  display: none;
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

</style>
