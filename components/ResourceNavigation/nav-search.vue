<template>
  <div class="search-wrapper" ref="wrapperRef">
    <form class="search-form" @submit.prevent="onSearch">
      <div class="search-engine-selector" @click.stop="togglePopover">
        <img class="search-engine-icon" :src="currentEngine.icon" :alt="currentEngine.name" />
        <svg class="dropdown-icon" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z"></path>
        </svg>
        <div class="search-engine-selector__popover" v-show="popoverVisible">
          <div class="search-engine-selector__popover-wrapper">
            <div
              class="search-engine-selector__popover-item"
              v-for="engine in engines"
              :key="engine.name"
              @click.stop="selectEngine(engine)"
            >
              <img :src="engine.icon" :alt="engine.name" />
            </div>
          </div>
        </div>
      </div>
      <input class="search-input" type="text" v-model="searchQuery" autocomplete="off" placeholder="你想找什么？" />
      <button type="submit" class="search-button">
        <!-- SVG内容需要根据您的具体情况调整 -->
        <svg class="search-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
           <path d="M862.609 816.955L726.44 680.785l-0.059-0.056a358.907 358.907 0 0 0 56.43-91.927c18.824-44.507 28.369-91.767 28.369-140.467 0-48.701-9.545-95.96-28.369-140.467-18.176-42.973-44.19-81.56-77.319-114.689-33.13-33.129-71.717-59.144-114.69-77.32-44.507-18.825-91.767-28.37-140.467-28.37-48.701 0-95.96 9.545-140.467 28.37-42.973 18.176-81.56 44.19-114.689 77.32-33.13 33.129-59.144 71.717-77.32 114.689-18.825 44.507-28.37 91.767-28.37 140.467 0 48.7 9.545 95.96 28.37 140.467 18.176 42.974 44.19 81.561 77.32 114.69 33.129 33.129 71.717 59.144 114.689 77.319 44.507 18.824 91.767 28.369 140.467 28.369 48.7 0 95.96-9.545 140.467-28.369 32.78-13.864 62.997-32.303 90.197-54.968 0.063 0.064 0.122 0.132 0.186 0.195l136.169 136.17c6.25 6.25 14.438 9.373 22.628 9.373 8.188 0 16.38-3.125 22.627-9.372 12.496-12.496 12.496-32.758 0-45.254z m-412.274-69.466c-79.907 0-155.031-31.118-211.534-87.62-56.503-56.503-87.62-131.627-87.62-211.534s31.117-155.031 87.62-211.534c56.502-56.503 131.626-87.62 211.534-87.62s155.031 31.117 211.534 87.62c56.502 56.502 87.62 131.626 87.62 211.534s-31.118 155.031-87.62 211.534c-56.503 56.502-131.627 87.62-211.534 87.62z" fill="" p-id="1560"></path>

        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
const router = useRouter();
const searchQuery = ref('');
const engines = reactive([
    { name: 'Internal', icon: '/icon/internal.png' },
    { name: 'Baidu', icon: '/icon/baidu.svg' },
    { name: 'Google', icon: '/icon/google.svg' },
]);
const currentEngine = ref(engines[0]);
const popoverVisible = ref(false);
const wrapperRef = ref(null);
const drawer = inject('drawer');
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

const onSearch = () => {
  drawer.value = false; // 关闭侧边栏
  console.log(`搜索: ${searchQuery.value} 使用: ${currentEngine.value.name}`);
  if (currentEngine.value.name === 'Internal') {
    // 使用内部搜索引擎，跳转到内部搜索结果页面
    router.push({ name: 'search-results', query: { q: searchQuery.value } });
    drawer.value = false; // 关闭侧边栏
  } else {
    // 构建外部搜索引擎的URL
    let searchURL = '';
    if (currentEngine.value.name === 'Baidu') {
      searchURL = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
    } else if (currentEngine.value.name === 'Google') {
      searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`;
    }
    // 使用window.location.href跳转到构建的URL
    if (searchURL) {
      window.location.href = searchURL;
    }
  }
};


// 全局点击事件处理器
const onGlobalClick = (event) => {
  // 如果点击发生在搜索引擎选择器以外的地方，关闭弹出框
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
  caret-color: #6699CC;
  caret-shape: block;
}

/* Customized styles for input text caret */
.search-input::selection {
  background: #6699CC;
  color: white;
}

/* Change the cursor for text inputs */
.search-input:focus {
  caret-color: #6699CC;
}

.search-button {
  padding: 0.5rem 1rem;
  background-color: #6699CC;
  border-radius: 0 22px 22px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
}

.search-button:hover {
  background-color: #1e6091;
  transition: background-color 0.3s ease;
}

.search-icon {
  fill: white;
  height: 24px;
  width: 24px;
  vertical-align: middle;
}

</style>
