<template>
  <div class="search-wrapper">
    <form class="search-form" @submit.prevent="onSearch">
      <!-- 搜索引擎切换 -->
      <div class="search-engine-selector" @click.stop="togglePopover">
        <img class="search-engine-icon" :src="currentEngine.icon" :alt="currentEngine.name" />
        <svg class="dropdown-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path></svg>
        <div class="search-engine-selector__popover" v-show="popoverVisible">
          <div class="search-engine-selector__popover-wrapper">
            <div class="search-engine-selector__popover-item" v-for="engine in engines" :key="engine.name" @click.stop="selectEngine(engine)">
              <img :src="engine.icon" :alt="engine.name" />
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索内容输入 -->
      <input class="search-input" type="text" v-model="searchQuery" autocomplete="off" placeholder="你想找什么？" />

      <!-- 搜索按钮 -->
      <v-btn type="submit" variant="plain" icon="search" class="search-button"></v-btn>
    </form>
  </div>
</template>

<script setup>
/*————————————————————————搜索引擎切换————————————————————————*/
const engines = reactive([
  { name: 'Internal', icon: '/icon/internal.png' },
  { name: 'Baidu', icon: '/icon/baidu.svg' },
  { name: 'Google', icon: '/icon/google.svg' },
]);
const currentEngine = ref(engines[0]);
const popoverVisible = ref(false);
const togglePopover = () => {
  popoverVisible.value = !popoverVisible.value;
};
const closePopover = () => {
  if (popoverVisible.value) {
    popoverVisible.value = false;
  }
};
const selectEngine = (engine) => {
  currentEngine.value = engine;
};

// 如果点击发生在搜索引擎选择器以外的地方，关闭弹出框
const onGlobalClick = (event) => {
  if (!event.target.closest('.search-engine-selector')) {
    closePopover();
  }
};

onMounted(() => {
  window.addEventListener('click', onGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', onGlobalClick);
});

/*————————————————————————搜索实现逻辑————————————————————————*/
const router = useRouter();
const searchQuery = ref('');

const onSearch = () => {
  if (currentEngine.value.name === 'Internal') {
    // 使用内部搜索引擎，跳转到内部搜索结果页面
    router.push({ name: 'search-results', query: { q: searchQuery.value } });
  } else {
    // 构建外部搜索引擎的URL
    let searchURL = '';
    if (currentEngine.value.name === 'Baidu') {
      searchURL = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
    } else if (currentEngine.value.name === 'Google') {
      searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`;
    }
    if (searchURL) {
      window.open(searchURL, '_blank') // 新建标签页打开
    }
  }
};
</script>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: white;
  margin-bottom: 3rem;
}
.search-form {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 22px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
.search-form:hover,
.search-form:focus-within {
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.search-engine-selector {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.search-engine-icon,
.dropdown-icon {
  height: 24px;
  width: 34px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
.search-engine-selector:hover .search-engine-icon,
.search-engine-selector:hover .dropdown-icon {
  opacity: 1;
}
.search-engine-selector__popover {
  position: absolute;
  top: calc(100% + 1rem);
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;
  transition: opacity 0.3s ease-in-out;
  margin-top: 0.5rem;
}
.search-engine-selector__popover-wrapper {
  display: flex;
  flex-direction: column;
}
.search-engine-selector__popover-item img {
  width: 24px;
  margin: 0.5rem;
  cursor: pointer;
}
.search-input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 22px 0 0 22px;
  outline: none;
}
.search-button {
  padding: 0.5rem 1rem;
  border-radius: 0 22px 22px 0;
  cursor: pointer;
  font-size:1.2rem;
  transition: background-color 0.5s ease;
}
.search-button:hover {
  font-size: 1.3rem;
  font-weight: bold;
  transition: background-color 0.5s ease;
}
</style>
