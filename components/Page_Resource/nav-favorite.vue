<template>
  <!-- 动态加载导航网址 -->
  <div class="favorites">
    <div v-for="(group, groupName) in groupedSites" :key="groupName" class="favorite-group">
      <h2 class="group-title">{{ groupName }}</h2>
      <ul class="favorite-list">
        <li class="favorite-item" v-for="site in group" :key="site.name">
          <a :href="site.url">
            <img class="site-icon" :src="site.iconUrl" :alt="site.name">
            <div class="site-info">
              <span class="site-name">{{ site.name }}</span>
              <span class="site-url">{{ site.url.replace(/https?:\/\/(www.)?/, '') }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 示例数据，应该从API或状态管理库获取
const sites = [
  { group: '资源下载', name: 'BTNULL', url: 'https://www.btnull.org', iconUrl: '/icon/btnull.png' },
  { group: '资源下载', name: 'MP4电影', url: 'https://www.mp4us.com', iconUrl: '/icon/mp4.png' },
  { group: '资源下载', name: 'BT之家', url: 'https://btbtt11.com', iconUrl: '/icon/bthome.png' },
  { group: '资源下载', name: '音范丝', url: 'https://www.yinfans.me', iconUrl: '/icon/yinfansi.png' },
  { group: '资源下载', name: '不太灵', url: 'https://www.6bt0.com', iconUrl: '/icon/butailing.png' },
  { group: '资源下载', name: '部落天堂', url: 'https://www.btbuluo.net', iconUrl: '/icon/buluo.png' },

  { group: '字幕下载', name: '字幕库', url: 'https://zmk.pw', iconUrl: '/icon/zimuku.png' },
  { group: '字幕下载', name: 'SubHD', url: 'https://subhd.tv', iconUrl: '/icon/subhd.png' },
  { group: '字幕下载', name: '人人字幕', url: 'https://www.yysub.net/subtitle', iconUrl: '/icon/rrzimu.png' },
  { group: '字幕下载', name: '射手网', url: 'https://assrt.net', iconUrl: '/icon/sheshou.png' },
  { group: '字幕下载', name: 'Subscene', url: 'https://subscene.com', iconUrl: '/icon/subscene.png' },
  { group: '字幕下载', name: '在线字幕编辑', url: 'https://www.nikse.dk/subtitleedit/online', iconUrl: '/icon/nikse.png' },
  { group: '字幕下载', name: '在线字幕下载', url: 'https://downsub.com', iconUrl: '/icon/downsub.png' },
];

// 通过group字段将sites数组转换成分组的对象
const groupedSites = computed(() => {
  return sites.reduce((acc, site) => {
    if (!acc[site.group]) {
      acc[site.group] = [];
    }
    acc[site.group].push(site);
    return acc;
  }, {});
});
</script>

<style>
.favorites {
  background: #eaf4f4; /* 浅黄色背景 */
  margin-left: 9.5rem;
}
.favorite-group .group-title {
  color: #95d5b2;
  font-size: 1.8rem;
  font-weight: 400;
  font-family: 'smiley-sans',sans-serif;
  letter-spacing: .2rem;
  display: flex;
  align-items: center;
  margin: 2rem 3rem 1.4rem 2rem;
  position: relative;
}
.group-title::before {
  width: 0.4rem;
  height: 0.4rem;
  content: "";
  display: block;
  margin-left: 1rem;
  margin-right: 1rem;
  background: #95d5b2;
  border-radius: 999px;
  opacity: .3;
}
.favorite-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 从左侧开始 */
  gap: 1rem; /* 间隙 */
  padding-left: 1.5rem;
  list-style-type: none; /* 移除列表小点 */
  margin-left: 3rem;
  margin-bottom: 2rem;
}
.favorite-item {
  width: calc(28% - 3rem);
  border-radius: 4px;
}
.favorite-item a {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  color: inherit;
  background-color: #eaf4f4;
  padding: 0.3rem;
  border-radius: 10px; /* 轻微的圆角 */
  box-shadow: none; /* 移除初始阴影 */
  transition: all 0.3s ease;
}
.favorite-item a:hover {
  border-color: #cce3de; /* 悬停时的边框颜色 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 悬停时的阴影 */
  transform: translateY(-5px);
}
.site-icon {
  width: 25px;
  height: 25px;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  border-radius: 50%; /* 圆形显示 */
  object-fit: cover; /* 保证图片内容适配容器而不失真 */
}
.site-info {
  display: flex; /* 设置flex布局 */
  flex-direction: column; /* 子元素垂直排列 */
}
.site-name {
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold; /* 加粗文字 */
}
.site-url {
  font-size: 0.8rem; /* 网址字号较小 */
  color: #aaa; /* 网址颜色较浅 */
  display: block; /* 换行显示 */
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
