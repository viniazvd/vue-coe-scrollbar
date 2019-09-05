<template>
  <div
    ref="wrapper"
    class="vue-coe-scroll"
    :style="translateY"
  >
    <div
      ref="fullscrollbar"
      class="full-scrollbar"
      :style="{ height: fullHeight + 'px' }"
      @mouseout="hide"
      @mouseover="show"
      @mousedown="onClick"
    />

    <div
      ref="scrollbar"
      class="scrollbar"
      :style="{
        opacity: +showScroll,
        display: scrollDisplay,
        height: scrollbarHeight + 'px',
        width: scrollbarWidth + 'px'
      }"
      @mouseout="hide"
      @mouseover="show"
    />

    <div ref="content" class="content">
      <slot />
    </div>
  </div>
</template>

<script>
import { bindEvent, easeInOutQuad } from './services'

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
    },

    scrollDuration: {
      type: Number,
      default: 300
    },

    speed: {
      type: Number,
      default: 0.1,
      validator: speed => speed >= 0.1 && speed <= 1
    }
  },

  data () {
    return {
      mutation: null,

      dragging: false,

      showScroll: true,
      activeScroll: true,

      timer: 0,

      height: 0,
      fullHeight: 0,

      lastPosition: 0,
      scrollPosition: 0,
      scrollbarHeight: 0,
      scrollbarWidth: 20,

      userSelect: 'auto',
      scrollDisplay: 'block'
    }
  },

  watch: {
    scrollPosition (value) {
      if (value <= 0) this.scrollPosition = 0
      if (value >= this.scrollTotal) this.scrollPosition = this.scrollTotal
    }
  },

  mounted () {
    const { wrapper, content } = this.$refs

    this.bindEvents()
    this.setPosition()
    this.initMutationObserver(wrapper, content)
  },

  computed: {
    translateY () {
      return {
        '--position-scroll': this.scrollPosition + 'px',
        '--position-content': this.contentPosition + 'px',
        'userSelect': this.userSelect
      }
    },

    total () {
      return Math.ceil(this.fullHeight - this.height)
    },

    scrollTotal () {
      return this.height - this.scrollbarHeight
    },

    contentPosition () {
      const percentage = (100 * this.scrollPosition) / this.scrollTotal

      if (percentage <= 0) return 0
      if (percentage >= 100) return -this.total

      return -((percentage / 100) * this.total)
    }
  },

  methods: {
    setHeights () {
      const { wrapper } = this.$refs

      this.height = wrapper.clientHeight
      this.fullHeight = wrapper.scrollHeight
      this.scrollbarHeight = Math.ceil(Math.pow(this.height, 2) / this.fullHeight)
    },

    handleScroll () {
      const oldFullHeight = this.fullHeight

      this.setHeights()
      this.scrollbarWidth = 20 / window.devicePixelRatio.toFixed(2)

      // remove scrollbar
      if (this.fullHeight <= this.height) {
        this.activeScroll = false
        this.scrollDisplay = 'none'
        return
      }

      this.activeScroll = true
      this.scrollDisplay = 'block'
    },

    setPosition () {
      this.show()

      this.handleScroll()

      this.hide()
    },

    onScroll ({ deltaY }) {
      if (!this.active || !this.activeScroll) return

      this.show()
      this.scrollPosition += Math.ceil(deltaY * this.speed)
      this.hide()
    },

    dragStart ({ clientY: currentY }) {
      this.dragging = true
      this.show()

      this.userSelect = 'none'
      this.lastPosition = currentY
    },

    dragMove ({ clientY: currentY }) {
      if (!this.dragging) return

      this.scrollPosition += currentY - this.lastPosition
      this.lastPosition = currentY
    },

    dragEnd (event) {
      this.dragging = false
      this.hide()
      this.userSelect = 'auto'
    },

    scrollTo (position) {
      const percentage = (100 * position) / this.fullHeight

      let time = 0
      const increment = 20
      const start = this.scrollPosition
      const end = this.scrollPosition + (percentage / 100) * this.scrollTotal

      const animate = () => {
        time += increment

        this.scrollPosition = easeInOutQuad(time, start, end - start, this.scrollDuration)

        if (time < this.scrollDuration) requestAnimationFrame(animate)
      }

      animate()
    },

    onClick ({ clientY }) {
      const { scrollbar, wrapper } = this.$refs
      const { top, height } = scrollbar.getBoundingClientRect()

      const lastY = Math.round(top - (height / 2))
      const currentY = clientY - (height / 2)

      const increment = lastY < currentY ? this.jump : - this.jump
      const position = wrapper.scrollTop + increment

      this.scrollTo(position)
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
        // resize event
        // to trigger on zoom
        // resizable observer does not detect this change
        bindEvent(window, 'resize', this.setPosition),
        bindEvent(window, 'mousemove', this.dragMove), // move
        bindEvent(window, 'mouseup', this.dragEnd, { passive: true }), // end
        bindEvent(window, 'wheel', this.onScroll, { passive: true }), // scroll
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
@mixin desktop {
  @media only screen and (max-width: 575px) { @content; }
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;

  overflow: hidden;
  @include desktop { overflow: visible; }
}

.vue-coe-scroll {
  height: 100%;
  position: relative;

  overflow: hidden;
  @include desktop { overflow: visible; }

  & > .full-scrollbar {
    top: 0;
    right: 0;
    z-index: 2;
    width: 10px;
    position: fixed;
    transition: opacity 0.5s;
  }

  & > .scrollbar {
    right: 0;
    z-index: 2;
    position: absolute;

    display: block;

    border-radius: 30px;
    border-color: transparent;
    background: linear-gradient(135deg, #BC4CF7, #7873EE);

    transition: opacity 0.5s;
    transform: translateY(var(--position-scroll));

    visibility: visible;
    @include desktop { visibility: hidden; }
  }

  & > .content {
    z-index: 1;
    height: 100%;
    transform: translateY(var(--position-content));
  }
}
</style>
