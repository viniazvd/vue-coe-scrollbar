<template>
  <div ref="wrapper" class="vue-coe-scroll">
    <div
      class="full-scrollbar"
      ref="fullscrollbar"
      @click="onClick"
      @mouseover="show"
      @mouseout="hide"
    />

    <div
      ref="scrollbar"
      class="scrollbar"
      :style="{ opacity: +showScroll }"
      @mouseover="show"
      @mouseout="hide"
    />

    <div class="content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
import { isMobile, bindEvent } from './services'

export default {
  name: 'vue-coe-scrollbar',

  props: {
    active: {
      type: Boolean,
      default: true
    },

    jump: {
      type: Number,
      default: 700
    },

    disappear: {
      type: Number,
      default: 1500
    }
  },

  data () {
    return {
      timer: 0,
      events: {},
      mutation: null,
      dragging: false,
      lastPosition: 0,
      showScroll: true,
      activeScroll: true
    }
  },

  watch: {
    $route() {
      // TODO
      console.log('wip')
    }
  },

  mounted () {
    // TODO: must to be reactive?
    this.events = {
      'start': isMobile() ? 'touchstart' : 'mousedown',
      'move': isMobile() ? 'touchmove' : 'mousemove',
      'end': isMobile() ? 'touchend' : 'mouseup'
    }

    const { wrapper: el, content } = this.$refs

    this.bindEvents()
    this.setPosition()
    this.initMutationObserver(el, content)
  },

  methods: {
    onScroll (e) {
      if (!this.active || !this.activeScroll) return

      this.show()
      this.$el.scrollTop += e.deltaY
      this.hide()
    },

    dragStart ({ clientY: currentY, touches }) {
      this.dragging = true
      this.show()

      this.$refs.wrapper.style.pointerEvents = 'none'

      this.lastPosition = currentY !== undefined ? currentY : touches[0].clientY
    },

    dragMove (event) {
      if (!this.dragging) return

      const currentY = event.clientY !== undefined
        ? event.clientY
        : event.touches[0].clientY

      this.$refs.wrapper.scrollTop += (currentY - this.lastPosition) / this.$refs.scrollbar.scaling
      this.lastPosition = currentY

      if (!isMobile()) event.preventDefault()
    },

    dragEnd (event) {
      this.dragging = false
      this.hide()

      this.$refs.wrapper.style.pointerEvents = 'auto'
    },

    handleScroll () {
      const { wrapper, scrollbar, fullscrollbar } = this.$refs

      const height = wrapper.clientHeight
      const fullHeight = this.$refs.content.scrollHeight

      // remove scrollbar
      if (fullHeight < height) {
        this.activeScroll = false
        scrollbar.style.display = 'none'
        return
      }

      const maxScrollTop = fullHeight - height
      const scrollbarHeight = Math.pow(height, 2) / fullHeight
      const maxTopOffset = height - scrollbarHeight

      this.activeScroll = true
      scrollbar.style.display = 'block'
      scrollbar.style.height = `${scrollbarHeight}px`
      scrollbar.scaling = maxTopOffset / maxScrollTop

      fullscrollbar.style.height = fullHeight + 'px'
    },

    setPosition () {
      this.show()
      this.handleScroll()

      const { scrollbar } = this.$refs

      const x = 1 / scrollbar.scaling
      scrollbar.style.transform = `
        scale(${x})
        matrix3d(
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, -1
        )
        translateZ(${- 1 - (x)}px)
      `

      this.hide()
    },

    onClick ({ clientY }) {
      const { scrollbar, wrapper } = this.$refs
      const { top, height } = scrollbar.getBoundingClientRect()

      const lastY = Math.round(top - (height / 2))
      const currentY = clientY - (height / 2)

      const increment = lastY < currentY ? this.jump : - this.jump
      const position = wrapper.scrollTop + increment

      wrapper.scrollTo({ top: position, behavior: 'smooth' })
    },

    show () {
      this.showScroll = true

      clearTimeout(this.timer)
    },

    hide () {
      clearTimeout(this.timer)

      if (this.dragging) return

      this.timer = setTimeout(() => this.showScroll = false, this.disappear)
    },

    bindEvents () {
      this.$eventsBinded = [
        bindEvent(window, 'wheel', this.onScroll),
        // resize event
        // to trigger on zoom
        // resizable observer does not detect this change
        bindEvent(window, 'resize', this.setPosition),
        bindEvent(window, this.events['move'], this.dragMove),
        bindEvent(window, this.events['end'], this.dragEnd, { passive: true }),
        bindEvent(this.$refs.scrollbar, this.events['start'], this.dragStart, { passive: true })
      ]
    },

    unbindEvents () {
      this.$eventsBinded.forEach(unbind => unbind())

      this.mutation.disconnect()
    },

    initMutationObserver (el, content) {
      this.mutation = new MutationObserver(mutations => {
        mutations.forEach(mutation => this.setPosition())
      })

      const config = { childList: true, characterData: true }

      this.mutation.observe(content, config)
    }
  },

  beforeDestroy () { this.unbindEvents() }
}
</script>

<style>
* { box-sizing: border-box; }

html, body {
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.vue-coe-scroll {
  height: 100vh;
  perspective: 1px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective-origin: right top;
}

.full-scrollbar {
  top: 0;
  right: 0;
  width: 17px;
  position: fixed;
  transition: opacity 0.5s;
}

.scrollbar {
  top: 0px;
  right: 0px;
  width: 17px;
  position: absolute;

  border-radius: 10px;
  border-color: transparent;
  -webkit-border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
  background: linear-gradient(135deg, #BC4CF7, #7873EE);

  pointer-events: initial;

  transition: opacity 0.5s;
  transform-origin: right top;
}
</style>
