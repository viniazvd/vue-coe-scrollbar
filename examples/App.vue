<template>
  <main class="app">
    <div class="app__header">
      <span class="app__name">{{ name }}</span>

      <button class="app__button" @click="content.pop()">remove</button>
      <button class="app__button" @click="content.push(content.length + 1)">add</button>
      <button class="app__button" @click="showModal = !showModal">show modal</button>
    </div>

    <vue-coe-scroll :active="!showModal" @scroll="scroll">
      <div class="list">
        <div v-for="x in content" :key="x" class="list__item">
          {{ x }}
        </div>
      </div>

      <Modal :is-opened="showModal" @close="showModal = false">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla fuga impedit consectetur corporis at architecto animi eaque ad itaque numquam tenetur, deserunt quidem reiciendis! Assumenda fugit sequi error culpa!
      </Modal>
    </vue-coe-scroll>
  </main>
</template>

<script>
import { name } from '../package.json'
import Modal from './components/Modal.vue'
import VueCoeScroll from '../src/Index.vue'

export default {
  components: { VueCoeScroll, Modal },

  data () {
    return {
      name,
      showModal: false,
      content: Array.from(({ length: 12 }), (x, i) => i)
    }
  },

  methods: {
    scroll (e) {
      // ...
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
  overflow: hidden;
  font-family: Arial;

  @media only screen and (max-width: 575px) { overflow: visible; }
}

.app {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    padding: 20px;
    align-items: center;
    // box-shadow: 0 4px 16px rgba(black, .5);
  }
  &__name {
    flex: 1;
    font-size: 24px;
    font-weight: 700;
  }
  &__button {
    border: 0;
    color: white;
    outline: none;
    margin: 0 4px;
    font-size: 16px;
    cursor: pointer;
    padding: 8px 16px;
    background: black;
    border-radius: 8px;
  }
}

.list {
  display: grid;
  grid-row-gap: 8px;
  grid-column-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  padding: 8px;
  margin-right: 20px;
  background: linear-gradient(135deg, rgba(salmon, .8) 0%, rgba(cyan, .6) 100%);

  &__item {
    background: rgba(200, 0, 255, .5);

    &:after{
      content: '';
      display: block;
      padding-top: 100%;
    }
  }
}
</style>
