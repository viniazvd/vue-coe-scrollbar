<template>
  <div ref="wrapper" class="vue-coe-scroll">
    <div
      class="full-scrollbar"
      ref="fullscrollbar"
      @mousedown="onClick"
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
import { bindEvent } from './services'

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
    const { wrapper, content } = this.$refs

    this.bindEvents()
    this.setPosition()
    this.initMutationObserver(wrapper, content)
  },

  methods: {
    onScroll ({ deltaY }) {
      if (!this.active || !this.activeScroll) return

      this.show()
      this.$refs.wrapper.scrollTop += deltaY
      this.hide()
    },

    dragStart ({ clientY: currentY }) {
      this.dragging = true
      this.show()

      this.lastPosition = currentY
      this.$refs.wrapper.style.userSelect = 'none'
    },

    dragMove ({ clientY: currentY }) {
      if (!this.dragging) return

      this.$refs.wrapper.scrollTop += (currentY - this.lastPosition) / this.$refs.scrollbar.scaling
      this.lastPosition = currentY
    },

    dragEnd (event) {
      this.dragging = false
      this.hide()
      this.$refs.wrapper.style.userSelect = 'auto'
    },

    handleScroll () {
      const { wrapper, scrollbar, fullscrollbar, content } = this.$refs

      const height = wrapper.clientHeight
      const fullHeight = content.scrollHeight

      // remove scrollbar
      if (fullHeight <= height) {
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
        bindEvent(window, 'wheel', this.onScroll), // scroll
        // resize event
        // to trigger on zoom
        // resizable observer does not detect this change
        bindEvent(window, 'resize', this.setPosition),
        bindEvent(window, 'mousemove', this.dragMove), // move
        bindEvent(window, 'mouseup', this.dragEnd, { passive: true }), // end
        bindEvent(this.$refs.scrollbar, 'mousedown', this.dragStart, { passive: true }) // start
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

<style lang="scss">
* { box-sizing: border-box; }

html, body {
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;

  overflow: hidden;
  @media only screen and (max-width: 575px) { overflow: visible; }
}

.vue-coe-scroll {
  flex: 1;
  perspective: 1px;
  transform-style: preserve-3d;
  perspective-origin: right top;

  overflow: hidden;
  @media only screen and (max-width: 575px) { overflow: visible; }
}

.full-scrollbar {
  top: 0;
  right: 0;
  width: 10px;
  position: fixed;
  transition: opacity 0.5s;
}

.scrollbar {
  top: 0px;
  right: -5px;
  width: 10px;
  position: absolute;

  border-radius: 10px;
  border-color: transparent;
  -webkit-border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
  background: linear-gradient(135deg, #BC4CF7, #7873EE);

  transition: opacity 0.5s;
  transform-origin: right top;

  visibility: visible;
  @media only screen and (max-width: 575px) { visibility: hidden; }
}
</style>
