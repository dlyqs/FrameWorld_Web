<template>
  <div class="details">
    <div class="header">
      <button @click="goBack()" class="back-button"><v-icon icon="chevron_left"/></button>
      <div class="header-title">{{ entry?.type }}</div>
    </div>

    <div class="entry-info" v-if="entry">
      <div class="entry-section">
        <img :src="entry.cover_url" alt="Cover image" class="entry-cover">
        <div class="entry-texts">
          <div class="entry-title">{{ entry.title }}</div>
          <div class="entry-detail">{{ entry.duration }} / {{ entry.version }} / {{ entry.year }}</div>
          <div class="entry-detail">{{ entry.genre }}</div>
          <div class="link-container">
            <div :class="['rating-star', 'bigstar' + getStarClass((entry.douban_rating + entry.imdb_rating) / 2)]"></div>

            <a :href="entry.douban_url" target="_blank" class="entry-link">
              <v-icon base class="link-icon"><svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M1023.979 862.827A161.152 161.152 0 0 1 862.805 1024H161.173A161.152 161.152 0 0 1 0 862.827V161.195A161.195 161.195 0 0 1 161.173 0.02h701.632a161.195 161.195 0 0 1 161.174 161.174v701.632z" fill="#05B711" p-id="4274"></path><path d="M218.56 208.064h586.816v66.09H218.56z m535.83 393.493v-258.41h-484.8v258.41h484.8zM339.882 409.173H684.8v126.358H339.883V409.173z m309.61 341.334c21.099-32.299 41.003-69.739 59.435-112.256l-70.507-25.707c-18.346 50.368-39.701 96.427-64 137.941H451.712c-20.373-53.802-43.328-99.818-69.077-137.941l-64.854 25.707c26.752 40.128 48.32 77.482 64.854 112.256H201.94v65.386h620.054v-65.386H649.493z" fill="#FFFFFF" p-id="4275"></path></svg></v-icon>
              <div class="rating-text">{{ entry.douban_rating }}</div>
            </a>
            <a :href="entry.imdb_url" target="_blank" class="entry-link">
              <v-icon base class="link-icon"><svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M610.56 409.088v0.224c-3.296-2.048-9.696-2.976-17.92-2.976v205.44c11.52 0 18.784-2.56 21.344-7.04 2.656-4.448 4.064-17.28 4.064-37.76v-122.272c0-14.08-0.16-23.04-1.408-26.88a12.384 12.384 0 0 0-5.984-8.704zM956.416 0H69.12A73.696 73.696 0 0 0 0 68.096V954.88c2.56 37.28 30.368 65.792 66.336 68.992 0.64 0.128 1.28 0.128 1.92 0.128h889.376a73.664 73.664 0 0 0 66.336-72.96V72.96A73.568 73.568 0 0 0 956.384 0zM204.448 666.72h-81.28v-314.272h81.28v314.272z m279.04-0.096h-70.912v-212.064L384 666.56h-50.688l-29.792-207.36-0.288 207.36H232.096v-314.144h105.312a2736 2736 0 0 1 9.824 67.168l11.52 79.776 18.848-146.944h105.952v314.208z m212.352-93.024c0 27.936-1.888 46.688-4.448 56.32-2.656 9.376-7.264 17.056-13.92 22.176-6.4 5.536-14.496 9.312-24.32 11.36-9.504 1.92-24.32 3.2-43.52 3.2l-0.16-0.096h-98.336v-314.144h60.832c39.008 0 61.856 2.016 75.52 5.472 13.856 3.84 24.544 9.6 31.776 17.92 7.04 7.68 11.648 17.248 13.344 27.52 2.144 10.016 3.232 30.08 3.232 59.808v110.432z m210.944 20.288c0 19.2-1.92 32.608-3.84 42.24-2.56 9.568-8.32 17.248-17.28 24.224-9.632 7.072-20.48 10.24-33.28 10.24-9.376 0-21.344-2.56-29.024-5.792a68 68 0 0 1-21.984-18.208l-4.96 20.064h-73.248v-314.208l-0.864-0.128h76.8v102.4c6.4-7.456 13.44-13.216 21.76-17.056 8.352-3.552 19.872-5.408 29.44-5.408 9.632-0.128 19.2 1.536 28.16 4.896 7.264 2.976 13.664 7.904 18.592 14.08 3.84 5.344 6.4 11.52 7.68 17.92 1.28 5.888 1.888 18.336 1.888 37.12v87.648zM814.08 478.08c-5.12 0-8.288 1.696-9.6 5.12-1.28 3.424-2.56 12.384-2.56 26.624v83.04c0 13.824 1.28 22.752 2.56 26.592a9.92 9.92 0 0 0 9.632 5.728c5.12 0 11.616-2.016 12.8-5.984 1.28-4.128 1.952-13.664 1.952-28.768l1.28-0.096v-80.64c0-12.928-0.64-21.664-2.56-25.728-1.888-4.256-8.32-5.984-13.44-5.984z" fill="#E6B91E" p-id="5285"></path></svg></v-icon>
              <div class="rating-text">{{ entry.imdb_rating }}</div>
            </a>
          </div>
        </div>
      </div>
      <hr/>

      <div class="summary-section">
        <div class="summary-title">简介</div>
        <div class="text-container">
          <div :class="{'summary-text': true, 'expanded': summaryExpanded}" ref="summaryText">{{ entry.description }}</div>
          <button class="toggle-button" v-if="shouldShowButton(entry.description)" @click="toggleExpand('summary')">{{ summaryExpanded ? '收起' : '展开' }}</button>
        </div>
      </div>

      <div class="cast-section">
        <div class="cast-title">演职员</div>
        <div class="cast-list">
          <div class="cast-item">导演:{{ entry.director }} </div>
          <div class="cast-item">编剧:{{ entry.writer }} </div>

        </div>
        <div class="text-container">
          <div :class="{'cast-item': true, 'expanded': castExpanded}" ref="castText">演员:{{ entry.cast }}</div>
          <button class="toggle-button" v-if="shouldShowButton(entry.cast)" @click="toggleExpand('cast')">{{ castExpanded ? '收起' : '展开' }}</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

function goBack() {
  router.push({ name: 'frameworld' });
}
const summaryExpanded = ref(false);
const castExpanded = ref(false);

function toggleExpand(section) {
  if (section === 'summary') {
    summaryExpanded.value = !summaryExpanded.value;
  } else if (section === 'cast') {
    castExpanded.value = !castExpanded.value;
  }
}
function shouldShowButton(text) {
  return text.length > 100; // 假设超过100个字符显示按钮
}
/*————————————————————————条目信息加载————————————————————————*/
const entryId = useEntryId();
onMounted(() => {
  entryId.value = route.query.entryId;
});
const entry = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(`/api/frameworld/entries/${entryId.value}/`);
    if (response.ok) {
      const data = await response.json();
      entry.value = data;
    } else {
      console.error('Failed to fetch entry data, Status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching entry data:', error);
  }
});

function getStarClass(rating) {
  // 将评分转换为5星制，四舍五入到最近的0.5
  const stars = Math.round((rating / 2) * 2) / 2;
  // 转换为类名，注意：这里我们需要的是一个固定的小数点后一位的数字，例如6.5应该转换为'35'
  return (stars.toFixed(1) * 10).toString();
}

</script>

<style scoped>
.details{
  overflow-y: auto;
}
/* 用于隐藏滚动条，对于webkit内核的浏览器 */
.details::-webkit-scrollbar {
  display: none;
}
.header {
  display: flex;
  align-items: center;
  padding: 1rem;
  top: 0;
  z-index: 100;
  width: 100%; /* 确保宽度是100% */
  box-sizing: border-box; /* 确保padding不会撑开宽度 */
}
.header-title {
  flex-grow: 1;
  text-align: center;
}
.entry-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: center;
}
.entry-texts {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.entry-info {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.entry-cover {
  width: 120px;
  height: 180px;
  display: flex;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
}
.entry-cover:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
.entry-title {
  margin-top: .5rem;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: smiley-sans, sans-serif;
  text-align: center;
}

.link-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .9rem;
}
.entry-link {
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
}
.link-icon {
  margin-top: .3rem;
  margin-right: .3rem;
  margin-left: .8rem;
}
.entry-detail{
  text-align: center;
  font-size: 1rem;
  color: #666;
}
.summary-section, .cast-section {
  padding: .5rem;
  margin-bottom: 1rem;
  width: 100%;
}
.summary-title, .cast-title {
  font-size: 1.3rem;
}

.cast-list {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}
/* CSS 代码保持原样，以下为展开逻辑需要添加或修改的样式 */
.entry-texts, .cast-list {
  width: auto;
}
.entry-texts, .cast-list {
  display: block;
  word-wrap: break-word;
}

.text-container {
  display: flex;
  flex-wrap: wrap;

}
.summary-text, .cast-item {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

.summary-text {
  -webkit-line-clamp: 3; /* 初始最多显示三行 */
}

.cast-item {
  -webkit-line-clamp: 2; /* 初始最多显示两行 */
}

.expanded {
  display: block;
  -webkit-line-clamp: none; /* 移除行数限制 */
}
.toggle-button{
  margin-left: 14rem;
  white-space: nowrap;
}
.rating-text{
  margin-top: .4rem;
}
.rating-star{
  display: inline-block;
  overflow: hidden;
  background: url('https://cdn.jsdelivr.net/gh/dlyqs/IMG/rating.png') no-repeat;
  background-size: cover;
  width: 75px;
  height: 15px;
}
.bigstar50 { background-position: 0 0; }
.bigstar45 { background-position: 0 -15px; }
.bigstar40 { background-position: 0 -30px; }
.bigstar35 { background-position: 0 -45px; }
.bigstar30 { background-position: 0 -60px; }
.bigstar25 { background-position: 0 -75px; }
.bigstar20 { background-position: 0 -90px; }
.bigstar15 { background-position: 0 -105px; }
.bigstar10 { background-position: 0 -130px; }
.bigstar05 { background-position: 0 -145px; }
.bigstar00 { background-position: 0 -160px; }
</style>
