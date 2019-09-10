<h1 align="center">vue-coe-scrollbar ✅</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/npm/l/vuelidation.svg" alt="License" target="_blank"></a>
</p>

<br>

<p align="center">
  ✨ <a href="https://viniazvd.github.io/vue-coe-scrollbar/">Example</a>✨
</p>

<br>

## Competitive Diferentials
<ul style='margin: 0; padding: 0; color: red; list-style-type: none;'>
  <li>keyboard support</li>
  <li>bundle size: 2.2kB</li>
  <li>built with poi and bili</li>
  <li>native style and behavior</li>
  <li>clean and documented code</li>
  <li>compatibility SSR -ty @vinicius73</li>
  <li>state-based, preventing re-paint -ty @vinicius73</li>
  <li>based on transform, property calculated on GPU: ty, @VitorLuizC</li>
  <li>use requestAnimationFrame to improve scrolling animation performance</li>
</ul>

## Install
`yarn add vue-coe-scrollbar` or `npm install vue-coe-scrollbar`

**Example**
```vue
<template>
  <vue-coe-scrollbar @scroll="scroll">
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

## Event

Name       | About
-----      | -----
scroll     | Emit event on scroll

## Contributors
- https://github.com/Giseudo
- https://github.com/stephaniebang
- https://github.com/guibarscevicius

**Made in:** @convenia
