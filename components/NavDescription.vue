<template>
  <v-container>
    <!-- 标题 -->
    <v-row class="text-center my-4">
      <v-col>
        <h2 class="section-title">还有，给视频配上好的文案</h2>
      </v-col>
    </v-row>

    <!-- 圆环切换按钮 -->
    <v-row class="my-4 justify-center text-center">
      <v-col cols="12">
        <svg width="200" height="200" @click="rotateWheel" class="wheel">
          <!-- 圆环背景 -->
          <circle cx="75" cy="75" r="60" fill="none" stroke="#ddd" stroke-width="30" />
          <!-- 选中的圆环部分 -->
          <path
            :d="getArcPath(75, 75, 60, currentAngle, currentAngle + 120)"
            :stroke="currentOption === 0 ? 'lightpink' : '#ddd'"
            fill="none"
            stroke-width="30"
          />
          <path
            :d="getArcPath(75, 75, 60, currentAngle + 120, currentAngle + 240)"
            :stroke="currentOption === 1 ? 'lightpink' : '#ddd'"
            fill="none"
            stroke-width="30"
          />
          <path
            :d="getArcPath(75, 75, 60, currentAngle + 240, currentAngle + 360)"
            :stroke="currentOption === 2 ? 'lightpink' : '#ddd'"
            fill="none"
            stroke-width="30"
          />
          <!-- 圆环文字路径 -->
          <!-- 定义文字路径 -->
          <path id="textpath" d="M75,15 A60,60 0 1 1 74,15" fill="none" />

          <!-- 应用文字路径 -->
          <text font-size="12">
            <textPath xlink:href="#textpath" startOffset="16%" text-anchor="middle">视频标题</textPath>
          </text>
          <text font-size="12">
            <textPath xlink:href="#textpath" startOffset="50%" text-anchor="middle">封面图</textPath>
          </text>
          <text font-size="12" >
            <textPath xlink:href="#textpath" startOffset="83%" text-anchor="middle">视频简介</textPath>
          </text>

          </svg>
      </v-col>
    </v-row>

    <!-- 文本提示 -->
    <v-row class="text-tips">
      <v-col>
        <v-card class="mx-auto" max-width="300" outlined elevation="2">
          <v-card-text class="body-2">
            {{ optionText }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <v-col>
        <Conversation :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Conversation from '~/components/Conversation/Conversation.vue'; // 确保路径正确
import { useRoute, useRouter } from 'vue-router';
// 假设以下是与Conversation组件相关的数据和方法
const route = useRoute();
const router = useRouter();
const conversation = ref(getDefaultConversationData()); // 假设这是获取默认对话数据的方法
const conversationComponent = ref(null);
//页面标识
const sourcePage = 'description';


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
    conversation.value.loadingMessages = true;
    const conversationSourcePage = await loadConversation();
    if (conversationSourcePage === sourcePage) {
      // 当前页面的sourcePage与对话的sourcePage匹配
      await loadMessage();
      conversation.value.loadingMessages = false;
      // 保持在当前页面，但更新路由以反映新的对话ID
      await router.push({ path: '/', hash: 'description'});
    } else {
      // 如果不匹配，可能需要执行一些操作，比如跳转到正确的页面或显示一条消息
      console.log(`对话属于其他页面: ${conversationSourcePage}`);
      // 例如，跳转到对话实际属于的页面
      // await router.push({ path: `/${conversationSourcePage}/${newId}` });
      conversation.value.loadingMessages = false;
    }
  }
}, { immediate: true });


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}

const currentOption = ref(0);
const currentAngle = computed(() => currentOption.value * 120);

const optionsText = ['视频标题', '视频简介', '封面图']; // 这个数组包含了每个选项对应的描述文本



const optionText = computed(() => {
  const text = optionsText[currentOption.value]; // 获取当前选项的描述文本
  return `已切换到${text}生成模式，已针对${text}的回答建议做出优化。`;
});

function rotateWheel() {
  currentOption.value = (currentOption.value + 1) % optionsText.length; // 使用 optionsText.length 确保索引不会超出数组范围
}

// 下面这个函数相当于describeArc
const getArcPath = (cx, cy, radius, startAngle, endAngle) => {
  return describeArc(cx, cy, radius, startAngle, endAngle);
};
</script>

<style scoped>
.section-title {
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-size: 32px; /* 调整字体大小 */
  font-weight: bold; /* 加粗 */
  font-family: "Times New Roman", Times, serif; /* 使用更高级的字体 */
  color: #343a40; /* 字体颜色 */
  text-align: center; /* 文本居中 */
  text-transform: uppercase; /* 转换为大写字母 */
}
.text-tips {
  margin: 0 auto;
}
.wheel {
  cursor: pointer;
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
}

.wheel:hover {
  transform: scale(1.1);
}

.wheel:active {
  transform: scale(1);
}
</style>
