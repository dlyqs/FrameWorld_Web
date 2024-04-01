<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn class="btn_more" v-bind="props" icon="more_horiz" variant="text"></v-btn>
    </template>
    <v-list class="list_more">
      <v-list-item class="list_item_more" @click="copyMessage" title="Copy" prepend-icon="content_copy"></v-list-item>
    </v-list>
  </v-menu>

  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import copy from 'copy-to-clipboard';

const props = defineProps({
  message: Object,
});
const snackbar = ref(false);
const snackbarText = ref('');

// 复制消息内容并显示提示
const copyMessage = () => {
  copy(props.message.message);
  snackbarText.value = 'Copied!';
  snackbar.value = true;
};
</script>

<style scoped>
.btn_more{
  margin: .5rem;
}
.list_more{
  margin: .5rem;
  border-radius: 1rem !important;
}
.list_item_more{
  margin: 5px;
}
.list_item_more:hover{
  border-radius: 1rem;
}
</style>
