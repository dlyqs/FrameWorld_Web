<script setup>
import copy from 'copy-to-clipboard';

const props = defineProps({
  message: Object,
});
const snackbar = ref(false);
const snackbarText = ref('');
const copyMessage = () => {
  copy(props.message.message);
  snackbarText.value = 'Copied!';
  snackbar.value = true;
};
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon variant="text">
        <v-icon>more_horiz</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="copyMessage" title="Copy" prepend-icon="content_copy"></v-list-item>
    </v-list>
  </v-menu>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<style scoped>

</style>
