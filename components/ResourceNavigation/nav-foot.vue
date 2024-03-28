<template>
  <footer class="nav-foot">
    <button class="nav-foot__action">白天</button>
    <div class="nav-foot__info">© 2024 dlyqs</div>
  </footer>
</template>

<style>
.nav-foot {
  padding: 1rem;
  background-color: #f8f9fa; /* 浅灰色背景 */
  text-align: center;
  border-top: 1px solid #eaeaea; /* 添加上边框 */
}

.nav-foot__action {
  padding: 0.5rem 1rem; /* 更大的填充 */
  margin-bottom: 1rem; /* 更大的下边距 */
  color: #5a5a5a; /* 更深的字体颜色 */
  background-color: #ffffff; /* 白色背景 */
  border: none; /* 移除边框 */
  border-radius: 20px; /* 圆角 */
  cursor: pointer; /* 鼠标样式 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.nav-foot__action:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 悬停时的阴影 */
  background-color: #e9ecef; /* 悬停时的背景颜色 */
}

.nav-foot__info {
  color: #5a5a5a; /* 信息的字体颜色 */
  font-size: 0.8rem; /* 字体尺寸 */
  margin-top: 0.5rem; /* 与按钮的间距 */
}
</style>
