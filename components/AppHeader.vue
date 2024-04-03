<script setup>

</script>

<template>
  <v-btn variant="outlined" prepend-icon="add_comment" class="btn_home" @click="changeView('welcome')">首页</v-btn>
  <v-col :span="8">
    <div class='nav-goto'>
      <!-- 导航链接 -->
      <div class='nav-links nav_1' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('idea')">构思</div>
      <div class='nav-links nav_2' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('source')">素材</div>
      <div class='nav-links nav_3' @mouseover="hoverIn" @mouseout="hoverOut" @click="changeView('description')">文案</div>
      <router-link to="/Page_FrameWorld/Home" target="_blank" class='nav-links nav_4' @mouseover="hoverIn" @mouseout="hoverOut">帧世界</router-link>
    </div>
  </v-col>
</template>

<style scoped>

</style>