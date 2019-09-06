<template>
  <main class="App">
    <h1 class="App__title">
      <span class="App__name">{{ name }}</span>
      <button @click="content.push('kkk')">add</button>
      <button @click="content.pop()">remove</button>
      <span class="App__total">n contents {{ content.length }}</span>
    </h1>

    <vue-coe-scroll class="List" :scrollbar-width="12">
      <div v-for="(x, i) in content" :key="i" class="List__item"></div>
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
* { box-sizing: border-box; }

html, body {
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;
  font-family: Arial;
  overflow: hidden;

  @media only screen and (max-width: 575px) { overflow: visible; }
}

.App {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__title { font-size: 28px; }
  &__name { display: block; }
}

.List {
  & > .content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    padding: 10px;
  }
  &__item {
    background: red;
    &:after{
      content: '';
      display: block;
      padding-top: 100%;
    }
  }
}
</style>
