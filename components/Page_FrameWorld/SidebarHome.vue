<template>
  <div class="sidebar-home">
    <ul>
      <li v-for="item in entries" :key="item.id" @click="goToDetail(item.id)">
        {{item.title}}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const entries = [{id: 1, title: 'Entry 1'}, {id: 2, title: 'Entry 2'}]
const router = useRouter()

function goToDetail(id) {
  router.push({ name: 'frameworld', query: { entryId: id } });
}
</script>

<style scoped>
.sidebar-home{

}
</style>