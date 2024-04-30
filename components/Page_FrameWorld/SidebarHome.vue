<template>
  <div>
    <!-- Header -->
    <header class="app-header">
      <div class="search-wrapper">
        <form class="search-form">
          <!-- 搜索内容输入 -->
          <input class="search-input" type="text" autocomplete="off" placeholder="你想找什么？" />
          <!-- 搜索按钮 -->
          <v-btn type="submit" variant="plain" icon="search" class="search-button"></v-btn>
        </form>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" @click="currentTab = tab" :class="{ active: currentTab === tab }">
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-show="currentTab === '电影'" class="tab-pane">
        <!-- Tab 1 Content -->
        <div class="category-buttons">
          <span class="sort-option" :class="{ active: currentCategory === '院线' }" @click="currentCategory = '院线'">院线</span>|
          <span class="sort-option" :class="{ active: currentCategory === '推荐' }" @click="currentCategory = '推荐'">推荐</span>
        </div>
        <div class="entries-container">
          <div class="entry" v-for="entry in (currentCategory === '院线' ? cinemaEntries : recommendedEntries)" :key="entry.id">
            <img :src="entry.cover" alt="Cover image" class="entry-cover" @click="goToDetail(entry.id)">
            <div class="entry-title" @click="goToDetail(entry.id)">{{ entry.title }}</div>
          </div>
        </div>
        <div class="top-movies-container">
          <div class="top-movies-header">豆瓣电影 Top250</div>
          <ul class="top-movies-list">
            <li v-for="movie in topMovies" :key="movie.id" @click="goToDetail(movie.entryID)">
              <span class="movie-id">{{ movie.id }}</span>
              <img class="movie-cover" :src="movie.cover" alt="Cover">
              <span class="movie-title">{{ movie.title }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-show="currentTab === '电视'" class="tab-pane">
        <!-- Tab 2 Content -->
        Content for Tab 2 here.
      </div>
      <div v-show="currentTab === '音乐'" class="tab-pane">
        <!-- Tab 3 Content -->
        Content for Tab 3 here.
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const tabs = ['电影', '电视', '音乐'];
const currentTab = ref('电影');
const recommendedEntries = ref([
    {id: 1, title: '坠落的审判', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/1.jpg'},
    {id: 2, title: '王祖贤混剪', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/wangzuxian.jpg'},
    {id: 1, title: '沙丘2', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/dune2.jpg'},
    {id: 2, title: '芭比', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/barbie.jpg'},
])
const cinemaEntries = ref([
    {id: 13, title: '哥斯拉大战金刚2', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/13.jpg'},
    {id: 14, title: '白日之下', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/14.jpg'},
    {id: 15, title: '哈尔的移动城堡', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/15.jpg'},
    {id: 16, title: '年少日记', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/16.jpg'},
])
const topMovies = ref([
    {id: 1,entryID: 3, title: '肖申克的救赎', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/3.jpg'},
    {id: 2,entryID: 4, title: '教父', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/4.jpg'},
    {id: 3,entryID: 5, title: '蝙蝠侠:黑暗骑士', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/5.jpg'},
    {id: 4,entryID: 6, title: '教父2', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/6.jpg'},
    {id: 5,entryID: 7, title: '十二怒汉', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/7.jpg'},
    {id: 6,entryID: 8, title: '辛德勒的名单', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/8.jpg'},
    {id: 7,entryID: 9, title: '指环王3:王者归来', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/9.jpg'},
    {id: 8,entryID: 10, title: '低俗小说', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/10.jpg'},
    {id: 9,entryID: 11, title: '指环王:护戒使者', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/11.jpg'},
    {id: 10,entryID: 12, title: '黄金三镖客', cover:'https://cdn.jsdelivr.net/gh/dlyqs/IMG/12.jpg'},
])

const currentCategory = ref('推荐'); // 默认分类

const router = useRouter()
const entryId = useEntryId();
function goToDetail(id) {
  entryId.value = id
  router.push({ name: 'frameworld', query: { entryId: id } });
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  top: 0;
  z-index: 100;
  width: 100%; /* 确保宽度是100% */
  box-sizing: border-box; /* 确保padding不会撑开宽度 */
}

.tabs button {
  padding: .8rem;
  margin-bottom: -1px; /* 这会使得下划线和分割线连接 */
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-left: .8rem;
}

.tabs button.active {
  border-color: pink;
  border-width: 3px;
}
.tabs:after {
  content: '';
  display: block;
  border-bottom: 1px solid #ddd;
  position: relative;
  top: 1px;
  padding-left: .5rem;
}
.tabs {
  font-weight: bold;
  font-size: 1.1rem;
}
.tab-content .tab-pane {
  padding: 20px;
}
.entries-container {
  display: flex;
  overflow-x: auto; /* 允许横向滚动 */
  margin-top: 1rem;
}
/* 自定义滚动条样式 */
.entries-container::-webkit-scrollbar {
  height: .5rem; /* 滚动条的高度 */
}

/* 滚动条的轨道 */
.entries-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* 轨道的颜色 */
  border-radius: 1rem; /* 轨道的圆角 */
}

/* 滚动条的滑块 */
.entries-container::-webkit-scrollbar-thumb {
  background: #888; /* 滑块的颜色 */
  border-radius: 1rem; /* 滑块的圆角 */
}

/* 当鼠标悬停在滑块上时的样式 */
.entries-container::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滑块的悬停颜色 */
}

.entry {
  flex-basis: calc(33.333% - 20px); /* 减去的 20px 是为了间距 */
  margin-right: 10px;
  margin-left: 10px;
  flex-shrink: 0;
  flex-grow: 1; /* 允许条目根据可用空间增长 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.entry-cover {
  width: 80px;
  height: 120px;
  display: flex;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.entry-cover:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
.entry-title {
  margin-bottom: .4rem;
  text-align: center;
  font-size: 1.2rem;
  font-family: smiley-sans, sans-serif;
}
.sort-option {
  cursor: pointer;
  padding: 5px;
  font-size: 1rem;
  user-select: none;
  color: rgba(0,0,0,0.4);
}

.sort-option.active {
  color: rgba(0,0,0,0.8);
  font-weight: bold;
}
.search-wrapper {
  width: auto;
  height: 3rem;
  display: flex;
}
.search-form {
  display: flex;
  align-items: center;
  width: 100%;
  transition: background-color 0.3s, border-color 0.3s;
  background-color: #f0f0f0 ;
  border: 2px solid #f0f0f0;
  border-radius: 1rem;
}
.search-form:hover,
.search-form:focus-within {
  background-color: #fff ;
  border-color: #f0f0f0 !important;
  outline: none;
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
.top-movies-container {
  margin-top: 2rem;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border-radius: 8px;
  background-color: black;
  background-image:
      linear-gradient(
          to bottom,
          rgba(33,37,41,0) 0, /* 开始为完全透明 */
          rgba(33,37,41,0) 2rem, /* 从顶部到30%的位置仍然是透明 */
          rgba(33,37,41,0.6) 5rem, /* 从30%的位置开始变成纯色 */
          rgba(33,37,41,1) 8rem, /* 从30%的位置开始变成纯色 */
          rgba(33,37,41,1) /* 至底部为纯色 */
      ),
      url('https://cdn.jsdelivr.net/gh/dlyqs/IMG/xiaoshenke.jpg');
  background-size:contain;
  background-repeat: no-repeat;
  background-position: top;
  color: seashell;
  position: relative;
}

.top-movies-header {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-left: .5rem;
}

.top-movies-list {
  list-style: none;
  padding: 0;
  max-height: 13.5rem;
  overflow-y: auto;
}
/* 用于隐藏滚动条，对于webkit内核的浏览器 */
.top-movies-list::-webkit-scrollbar {
  display: none;
}

.top-movies-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.movie-id {
  margin-left: 10px;
  font-size: 1rem;
  font-weight: bold;
}

.movie-cover {
  width: 24px;
  height: 36px;
  margin: 0 10px;
  border-radius: 3px;
}

.movie-title {
  font-size: .95rem;
  font-weight: bolder;
}
</style>