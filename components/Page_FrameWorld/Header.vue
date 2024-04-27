<template>
  <v-app-bar class="header">
    <!-- 用户信息 -->
    <div class="user-card" id="menu-activator">
      <v-card class="user-info">
        <v-row>
          <v-col>
            <v-avatar class="user-avatar">
              <img :src="userinfo?.avatar_url" alt="User's avatar">
            </v-avatar>
          </v-col>
          <v-col>
            <div class="user-name">{{ user?.username }}</div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- 用户管理 -->
    <v-menu activator="#menu-activator" offset-y absolute nudge-top="10" min-width="inherit" transition="slide-y-transition">
      <v-list class="user-list">
        <v-list-item class="user-list-item" @click="signOut">
          <v-icon class="list-item-icon">logout</v-icon>
          <span class="list-item-content">退出</span>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-menu>

    <!-- 导航链接 -->
    <div class='nav-goto'>
      <div class='nav-links' @mouseover="hoverIn" @mouseout="hoverOut">视频</div>
      <div class='nav-links' @mouseover="hoverIn" @mouseout="hoverOut">声音</div>
    </div>
  </v-app-bar>
</template>

<script setup>
const props = defineProps({
  user: Object,
  userinfo: Object,
});

// header标签hover动效
const hoverIn = (event) => {
  document.querySelectorAll('.nav-links').forEach(el => {
    el.style.color = '#C0C4CC';
  });
  event.target.style.color = '#f89898';
};
const hoverOut = () => {
  document.querySelectorAll('.nav-links').forEach(el => {
    el.style.color = '#303133';
  });
};

/*————————————————————————用户管理————————————————————————*/
const menu = ref(false)
// 用户登出
const signOut = async () => {
  const { error } = await useFetch('/api/account/logout/', {
    method: 'POST'
  })
  if (!error.value) {
    await logout()
    menu.value = false
  }
}
</script>

<style scoped>
.header{
  box-shadow: 0 4px 2px -4px rgba(0,0,0,0.12);
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-divider {
  height: 10px;
  margin: 0.8rem 0.8rem 0 0.8rem;
  background-color: rgba(0,0,0,0.12);
}

/* 用户管理 */
.user-card{
  padding: 0 1rem;
  position: relative;
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: none;
  transition: background-color 0.3s, box-shadow 0.3s;
  background-color: rgba(0, 0, 0, 0) ;
}
.user-info:hover, .v-menu__content--active .user-info {
  background-color: rgba(0, 0, 0, .05) !important;
}
.user-name {
  font-family: 'smiley-sans', sans-serif;
  font-weight: bold;
  margin-left: -0.8rem;
  margin-top: 0.5rem;
  font-size: 1.2rem;
}
.user-list{
  margin-top: 0.5rem;
  width: 7.4rem;
}
.user-list-item {
  border-radius: 0.5rem;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  display: flex;
}
.list-item-icon {
  margin-left: -0.1rem;
}
.list-item-content{
  margin-left: 0.1rem;
}
.user-list-item:hover {
  background-color: rgba(0,0,0,0.04);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.user-avatar{
  height: 34px;
  width: 34px;
  margin-left: 4px;
  margin-top: 2px;
}
.user-avatar img {
  width: 100%;
  height: auto;
}
.user-avatar:hover {
  transform: scale(1.2);
  border: 2px solid transparent;
  background-image: linear-gradient(white, white), radial-gradient(circle at top left, #ffcad4, #f4acb7);
  background-origin: border-box;
  background-clip: content-box, border-box;
  transition: 0.4s;
}

/* 页面切换 */
.nav-goto {
  align-items: center;
  display: flex;
  padding-left: 32rem;
}
.nav-links {
  font-size: 20px;
  cursor: pointer;
  font-weight: bolder;
  flex-grow: 1;
  padding: 3rem;
  transition: color 0.4s ease;
}
</style>