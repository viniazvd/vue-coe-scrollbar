<template>
  <main class="App">
    <h1 class="App__title">
      <code class="App__name">{{ name }}</code>
    </h1>

    <vue-coe-scroll>
      <button @click="content.push('kkk')">add</button>
      <button @click="content.pop()">remove</button>
      <span>n contents {{ content.length }}</span>

      <div v-for="(x, i) in content" :key="i" class='list'>{{ x }}</div>
    </vue-coe-scroll>
  </main>
</template>

<script>
import { name } from '../package.json'
import VueCoeScroll from '../src/Index.vue'

export default {
  components: { VueCoeScroll },

  data () {
    return {
      name,
      content: Array.from(({ length: 10 }), (x, i) => i)
    }
  }
}
</script>

<style lang="scss">
.App {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__title { font-size: 28px; }
}

.list {
  padding: 25vh 50px;
  border: 1px solid transparent;
}
</style>
