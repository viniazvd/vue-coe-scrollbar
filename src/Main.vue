<template>
  <vue-coe-scroll>
    <button @click="content.push('kkk')">add</button>
    <button @click="content.pop()">remove</button>
    <span>n contents {{ content.length }}</span>

    <div v-for="(x, i) in content" :key="i" class='list'>{{ x }}</div>
  </vue-coe-scroll>
</template>

<script>
import VueCoeScroll from './VueCoeScroll'

export default {
  name: 'example',

  components: { VueCoeScroll },

  data () {
    return {
      content: Array.from(({ length: 10 }), (x, i) => i)
    }
  }
}
</script>

<style>
.list {
  padding: 25vh 50px;
  border: 1px solid transparent;
}
</style>
