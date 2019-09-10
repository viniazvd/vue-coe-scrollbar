<h1 align="center">vue-coe-scrollbar ✅</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/npm/l/vuelidation.svg" alt="License" target="_blank"></a>
</p>

<br>

<p align="center">
  ✨ <a href="https://viniazvd.github.io/vue-coe-scrollbar/">Example</a>✨
</p>

<br>

**Competitive Diferentials**
<ul style='margin: 0; padding: 0; color: red; list-style-type: none;'>
  <li></li>
</ul>

<br>

**Install**
`yarn add vue-coe-scrollbar` or `npm install vue-coe-scrollbar`

**Example**
```vue
<template>
  <vue-coe-scrollbar emit-scroll @scroll="scroll" :active="!showModal">
    <div class="list">
      <div v-for="x in content" :key="x" class="list__item">
        {{ x }}
      </div>
    </div>
  </vue-coe-scroll>
</template>

<script>
import VueCoeScrollbar from 'vue-coe-scrollbar'

export default {
  components: { VueCoeScrollbar },

  data () {
    return {
      content: Array.from(({ length: 12 }), (x, i) => i)
    }
  },

  methods: {
    scroll (e) { // ... }
  }
}
</script>
```

<br>

## Props

Name                |   type   | default    | About
-----               | -------  | ---------- | ------
active              |  Boolean |  `true`    | Disable scroll if false
jump                |  Number  |  `700`     | Jump on click
disappear           |  Number  |  `1500`    | The delay before scrollbar hides
scrollDuration      |  Number  |  `300`     | The transition time on click/keydown (ms)
speed               |  Number  |  `0.1`     | The scroll wheel speed ratio
width               |  Number  |  `10`      | scrollbar width base
color               |  String  |  `#bbbbbb` | scrollbar color
background          |  String  |  `#fefefe` | scrollbar background

## Events

Name       | About
-----      | -----
scroll     | Emit event on scroll
