<template>
  <main class="app">
    <div class="app__header">
      <span class="app__name">{{ name }}</span>

      <button class="app__button" @click="content.pop()">remove</button>
      <button class="app__button" @click="content.push(content.length + 1)">add</button>
      <button class="app__button" @click="showModal = !showModal">show modal</button>
    </div>

    <vue-coe-scroll emit-scroll @coe:scroll="scroll" :active="!showModal">
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
      console.log(e)
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

.app {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    padding: 20px;
    box-shadow: 0 4px 16px rgba(black, .5);
  }
  &__name {
    flex: 1;
    font-size: 24px;
    font-weight: 700;
  }
  &__button {
    border: 0;
    background: black;
    color: white;
    border-radius: 8px;
    font-size: 16px;
    padding: 8px 16px;
    margin: 0 4px;
    cursor: pointer;
    outline: none;
  }
}

.list {
  background: linear-gradient(135deg, rgba(salmon, .8) 0%, rgba(cyan, .6) 100%);
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 8px;
  grid-row-gap: 8px;

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
