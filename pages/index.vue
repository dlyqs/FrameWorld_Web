<template>
  <v-app-bar class="header">
    <v-btn variant="outlined" class="btn_new_conversation" @click="changeView('welcome')">
      <i class="material-icons md-24" style="margin-right: 8px;">add_comment</i>
      新的对话
    </v-btn>
    <v-col :span="8">
      <div class='nav-left'>
        <!-- 导航链接 -->
        <div class='nav-links nav_1' @mouseover="hoverIn('nav_1')" @mouseout="hoverOut" @click="changeView('idea')">
          构思
        </div>
        <v-spacer></v-spacer>
        <div class='nav-links nav_2' @mouseover="hoverIn('nav_2')" @mouseout="hoverOut" @click="changeView('source')">
          素材
        </div>
        <v-spacer></v-spacer>
        <div class='nav-links nav_3' @mouseover="hoverIn('nav_3')" @mouseout="hoverOut" @click="changeView('description')">
          文案
        </div>
        <v-spacer></v-spacer>
        <a href="http://localhost:5173/" target="_blank" class='nav-links nav_4' @mouseover="hoverIn('nav_4')" @mouseout="hoverOut">
          帧世界
        </a>
      </div>
    </v-col>
  </v-app-bar>

  <v-main>
    <component :is="currentComponent" v-if="!route.params.id && conversation.messages.length === 0"/>
  </v-main>
</template>

<script setup>
import Welcome from '~/components/Welcome.vue';
import NavIdea from '~/components/NavIdea.vue';
import NavSource from '~/components/ResourceNavigation/NavSource.vue';
import NavDescription from '~/components/NavDescription.vue';

definePageMeta({
  middleware: ["auth"],
  path: '/:id?',
  keepalive: true
});

const route = useRoute();
const router = useRouter();
const drawer = useDrawer();
const conversation = ref(getDefaultConversationData());
const conversationComponent = ref(null);
const currentComponent = shallowRef(Welcome); // 用来存储当前显示的组件
const showNewConversationButton = ref(true); // 控制新的对话显示的变量

const componentAliases = {
  welcome: Welcome,
  idea: NavIdea,
  source: NavSource,
  description: NavDescription,
};
provide('drawer', drawer);

// 切换视图函数
const changeView = (view) => {
  if (Object.keys(componentAliases).includes(view)) {
    router.push({ path: '/', hash: view });
    currentComponent.value = componentAliases[view];
    showNewConversationButton.value = view !== 'source';
  }
};

// 监听 hash 变化，调整当前组件
const handleHashChange = () => {
  const hash = window.location.hash.slice(1);
  if (Object.keys(componentAliases).includes(hash)) {
    currentComponent.value = componentAliases[hash];
    showNewConversationButton.value = hash !== 'source';
  }
};

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // 初始化时也执行一次
});

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});

const createNewConversation = () => {
  if (route.path !== '/') {
    return navigateTo('/welcome');
  }
  conversation.value = getDefaultConversationData({ topic: '首页' });
};


onActivated(async () => {
  if (route.path === '/' && route.query.new !== undefined) {
    createNewConversation();
  }
});

const hoverIn = (element) => {
  const nav_1 = document.querySelector('.nav_1')
  const nav_2 = document.querySelector('.nav_2')
  const nav_3 = document.querySelector('.nav_3')
  const nav_4 = document.querySelector('.nav_4')
  nav_1.style.color = nav_2.style.color = nav_3.style.color = nav_4.style.color = '#C0C4CC'
  if (element === 'nav_1') {
    nav_1.style.color = '#f89898'
  } else if (element === 'nav_2') {
    nav_2.style.color = '#f89898'
  } else if (element === 'nav_3') {
    nav_3.style.color = '#f89898'
  } else if (element === 'nav_4') {
    nav_4.style.color = '#f89898'
  }
}
const hoverOut = () => {
  const nav_1 = document.querySelector('.nav_1')
  const nav_2 = document.querySelector('.nav_2')
  const nav_3 = document.querySelector('.nav_3')
  const nav_4 = document.querySelector('.nav_4')
  nav_1.style.color = nav_2.style.color = nav_3.style.color = nav_4.style.color = '#303133'
}
</script>

<style scoped>
.btn_new_conversation {
  border: none;
  color: #e5989b;
}
.btn_new_conversation:hover {
  background-color: #f8f1f1;
}
.header{
  box-shadow: 0 4px 2px -4px rgba(0,0,0,0.12);
}
.v-app-bar-nav-icon:hover {
  border-radius: 10px;
  box-shadow: 3px 3px 10px #f89898;
}

.v-toolbar-title {
  font-size: 30px;
}

.v-toolbar-title:hover {
  color: #f89898;
}

.nav-left {
  align-items: center;
  display: flex;
  padding: 15rem;
}

.nav-left ul {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.nav-links {
  font-size: 20px;
  cursor: pointer;
  font-weight: bolder;
  flex-grow: 1;
  transition: color 0.5s ease; /* 提供颜色变化的平滑过渡效果 */
  color: #303133; /* 默认颜色 */
}

.nav_4 {
  text-decoration: none; /* 移除下划线 */
  color: inherit; /* 使用继承的颜色 */
}
</style>
