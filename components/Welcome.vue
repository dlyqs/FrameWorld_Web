<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Welcome to <span class="text-primary">{{ appName }}</span></h1>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col>
        <Conversation :conversation="conversation" :source-page="sourcePage" ref="conversationComponent" />
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import { useRuntimeConfig } from '#imports';
import Conversation from '~/components/Conversation/Conversation.vue'; // 确保路径正确
// 直接获取appName，无需复杂的类型定义
const { public: { appName } } = useRuntimeConfig();
</script>

<style scoped>
.text-center{
  margin-top: 10rem;
}
</style>