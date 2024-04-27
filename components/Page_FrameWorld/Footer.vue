<template>
  <footer class="site-footer">
    <div class="footer-up">
      <div class="footer-left">
        <div class="days-counter">
          <h4>本站已运行</h4>
          <h1 class="days">214天</h1>
        </div>
      </div>
      <div class="footer-center">
        <h3 class="name">
          <em>👋 hello!</em>
        </h3>
      </div>
      <div class="footer-right">
        <h3>跳转</h3>
        <ul><li><a href="https://space.bilibili.com/9552818" target="_blank">近藤麻理梗のB站主页</a></li></ul>
      </div>
    </div>
    <div class="footer-down">
      <div class="footer-info">dlyqs · Copyright</div>
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
.site-footer {
  padding-inline: 3.5rem;
  margin-top: 2rem;
  margin-inline: auto;
  background: hsl(0deg 0% 99%);
  z-index: 2;
  position: relative;
  overflow: hidden;
  width: 100%;
}

/* 上 */
.footer-up {
  position: relative;
  padding: 3rem 0;
  display: grid;
  grid: auto /30% 40% 30%;
}
/* 左 */
.footer-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}
.days-counter {
  color: rgb(238 77 80 / .5);
  align-content: center;
  margin-left: 2rem;
}
.days-counter .days {
  font-family: 'smiley-sans', sans-serif;
  line-height: 1.25;
}
/* 中 */
.footer-center {
  display: grid;
  place-items: start center;
  place-content: center;
  background: linear-gradient(145deg,rgb(238 77 80 / 5%),rgb(251 145 104 / 5%),rgb(0 0 0 / .025));
  border-radius: .5rem;
}
.name{
  font-size: 1.5rem;
  color: rgb(251 145 104);
}
.name em {
  display: flex;
  background: rgb(251 145 104 / .1);
  border-radius: .5rem;
  margin: 0 .5em;
  padding: .5em;
  line-height: .5;
}
/* 右 */
.footer-right {
  margin-left: 10rem;
  margin-top: 1rem;
  align-content: center;
  font-size: 1rem;
}
.footer-right ul{
  gap: .5rem 1rem;
  margin: .5rem 0 0;
}
.footer-right ul li {
  text-transform: capitalize;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* 下 */
.footer-down {
  background: hsl(0deg 0% 99%);
  padding: 1rem 3.5rem;
  box-shadow: 0 .2rem 1rem 0 hsl(0deg 0% 10% / 10%);;
  font-size: .55rem;
  margin-inline: calc(3.5rem*-1);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  text-align: center;
}
.footer-info {
  margin: 0 auto;
  font-size: 1rem;
}
.footer-info::before {
  content: "©";
  margin-right: .8em;
  color: rgb(238 77 80 / .6);
}
</style>

