<template>
  <v-container class="wrapper">
    <!-- Header部分，包括返回按钮和搜索框 -->
    <div class="header">
      <v-btn class="back-button" icon @click="goBack">
        <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
          <path d="M393.390114 512.023536l347.948667-336.348468c20.50808-19.85828 20.50808-51.997258 0-71.792093-20.507056-19.826558-53.778834-19.826558-74.28589 0L281.990954 476.135164c-20.476357 19.826558-20.476357 51.981908 0 71.746044l385.061936 372.236839c10.285251 9.91379 23.728424 14.869662 37.173644 14.869662 13.446243 0 26.889417-4.956895 37.112246-14.901385 20.50808-19.826558 20.50808-51.919487 0-71.746044L393.390114 512.023536" p-id="7506" fill="#ffffff"></path>
        </svg>
      </v-btn>
      <!-- 搜索框可以在这里插入 -->
    </div>

    <!-- 加载指示器 -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="#fcb69f"></v-progress-circular>
    </div>

    <!-- 搜索结果列表 -->
    <div v-else class="search-results">
      <div v-for="result in searchResults" :key="result.title" class="search-result-item">
        <div class="search-result-header">
          <div class="search-result-image">
            <!-- 这里你可以根据实际情况插入图片 -->
            <img :src="result.cover_url" alt="Cover" class="search-result-avatar" />
          </div>
          <div class="search-result-title">
            <h3>
              <a :href="result.detail_url" target="_blank">{{ result.title }}</a> · {{ result.year }}
            </h3>
            <p>{{ result.category.join(', ') }} | {{ result.country.join(', ') }}</p>
            <p>导演：{{ result.director.join(', ') }} | 演员：{{ getShortActorList(result.actors) }}</p>
            <p>
              <a :href="result.douban_url" target="_blank">豆瓣评分：{{ result.ratings }}</a> | 上映信息： {{ result.release_date }}
            </p>
          </div>
        </div>
        <p class="search-result-description">简介：{{ result.description }}</p>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from '#imports';

const router = useRouter();
const route = useRoute();
const searchResults = ref([]);
const loading = ref(true);

onMounted(async () => {
  const query = route.query.q;
  if (query) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      searchResults.value = await response.json();
      searchResults.value = searchResults.value.map(item => ({
        ...item,
        actors: getShortActorList(item.actors)
      }));
    } catch (error) {
      console.error("Fetching search results failed:", error);
    } finally {
      loading.value = false;
    }
  }
});

const getShortActorList = actors => {
  return actors.length > 8 ? actors.slice(0, 8).concat(['...']) : actors;
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.wrapper {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 70px;
}

.back-button {
  background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%) !important;
  color: white;
  border: none;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative; /* 确保可以正确地定位伪元素 */
  overflow: visible; /* 使得伪元素可以在按钮外部显示 */
}

/* 添加伪元素用于显示'返回'文本 */
.back-button::after {
  content: '';
  position: absolute;
  left: 100%;
  white-space: nowrap; /* 确保文本不会换行 */
  opacity: 0; /* 默认情况下文本不显示 */
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateX(-50%);
}

.back-button:hover {
  border-radius: 50px;
  width: 80px;
}

.back-button:hover::after {
  content: ' 返回';
  opacity: 1;
  transform: translateX(10px); /* 根据需要调整距离 */
}

/* 加载指示器容器样式 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.search-results {
  padding-top: 1rem;
}

.search-result-item {
  border-bottom: 1px solid #ccc;
  padding: 1rem;
  transition: box-shadow 0.3s ease;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.search-result-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.search-result-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.search-result-image {
  width: 80px;
  height: 120px;
  display: flex;
  margin-right: 0.75rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
}

.search-result-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.search-result-title h3 {
  margin: 0;
}

.search-result-title a {

  color: #337ab7;
}

.search-result-title a:hover {
  text-decoration: underline;
  bottom: -2px; /* 根据实际情况调整 */
  color: #023e8a; /* 鼠标悬浮时文字颜色加深 */
  transition: width 0.3s ease;
}


.search-result-description {
  color: #545454;
  margin: 0.5rem 0;
}

/* 简介前的引号图标样式 */
.search-result-description::before {
  content: url('public/icon/quotation.svg'); /* 在这里替换为您的引号图片地址 */
  display: inline-block;
  margin-right: 0.25rem; /* 根据实际情况调整间距 */
}
</style>
