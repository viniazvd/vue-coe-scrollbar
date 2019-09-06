<template>
  <div ref="wrapper" class="vue-coe-scroll" :style="styles">
    <div
      class="full-scrollbar"
      :style="{
        height: fullHeight + 'px',
        width: scrollbarAppliedWidth + 'px'
      }"
      @mouseout="hide"
      @mouseover="show"
      @mousedown="onClick"
    />

    <div
      ref="scrollbar"
      v-show="hasScroll && active"
      class="scrollbar"
      :style="{
        opacity: +showScroll,
        width: scrollbarAppliedWidth + 'px',
        height: scrollbarHeight + 'px'
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
import {
  isValid,
  isArrow,
  getZoom,
  bindEvent,
  easeInOutQuad,
  getSrollValues
} from './services'

export default {
  name: 'vue-coe-scrollbar',

  props: {
    // Disable scroll if false
    active: {
      type: Boolean,
      default: true
    },

    // Jump on click
    jump: {
      type: Number,
      default: 700
    },

    // The delay before scrollbar hides
    disappear: {
      type: Number,
      default: 1500
    },

    // The transition time on click/keydown (ms)
    scrollDuration: {
      type: Number,
      default: 300
    },

    // The scroll wheel speed ratio
    speed: {
      type: Number,
      default: 0.1,
      validator: speed => speed > 0 && speed <= 1
    },

    scrollbarWidth: {
      type: Number,
      default: 12
    },

    // Emit event on scroll
    emitScroll: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      mutation: null,

      dragging: false,

      showScroll: true,
      hasScroll: true,          // fullHeight < height = false

      timer: 0,                 // Used to prevent scroll fade more than once

      height: 0,                // The view height (the clientHeight)
      fullHeight: 0,            // Total content height (.content scrollHeight)

      lastClickPosition: 0,     // Updated when full-scrollbar is clicked

      scrollbarPosition: 0,
      scrollbarAppliedWidth: 0, // scrollbarWidth / zoom

      userSelect: 'auto',       // Prevent selection on drag
    }
  },

  watch: {
    scrollbarPosition (value) {
      if (value <= 0) this.scrollbarPosition = 0
      if (value >= this.scrollTotal) this.scrollbarPosition = this.scrollTotal
    }
  },

  mounted () {
    const { wrapper, content } = this.$refs

    this.bindEvents()
    this.update()
    this.initMutationObserver(wrapper, content)
  },

  computed: {
    styles () {
      return {
        '--user-select': this.userSelect,
        '--position-scroll': this.scrollbarPosition + 'px',
        '--position-content': this.contentPosition + 'px'
      }
    },

    total () {
      return Math.ceil(this.fullHeight - this.height)
    },

    scrollTotal () {
      return this.height - this.scrollbarHeight
    },

    contentPosition () {
      const percentage = (100 * this.scrollbarPosition) / this.scrollTotal

      if (percentage <= 0) return 0
      if (percentage >= 100) return -this.total

      return -((percentage / 100) * this.total)
    },

    scrollbarHeight () {
      return Math.ceil(Math.pow(this.height, 2) / this.fullHeight)
    }
  },

  methods: {
    setHeights () {
      const { wrapper } = this.$refs

      this.height = wrapper.clientHeight
      this.fullHeight = wrapper.scrollHeight
    },

    update () {
      this.show()
      this.setHeights()

      this.scrollbarAppliedWidth = this.scrollbarWidth / getZoom()
      this.hasScroll = this.fullHeight > this.height

      this.hide()
    },

    onScroll (e) {
      if (!this.active || !this.hasScroll) return
      if (this.emitScroll) this.$emit('coe:scroll', e)

      this.show()
      this.scrollbarPosition += Math.ceil(e.deltaY * this.speed)
      this.hide()
    },

    dragStart ({ clientY: currentClickPosition }) {
      this.dragging = true
      this.show()

      this.userSelect = 'none'
      this.lastClickPosition = currentClickPosition
    },

    dragMove ({ clientY: currentClickPosition }) {
      if (!this.dragging) return

      this.scrollbarPosition += currentClickPosition - this.lastClickPosition
      this.lastClickPosition = currentClickPosition
    },

    dragEnd (event) {
      this.dragging = false
      this.hide()
      this.userSelect = 'auto'
    },

    scrollTo (y, duration = this.scrollDuration) {
      this.show()

      let time = 0
      const increment = 20
      const start = this.scrollbarPosition
      const percentage = (100 * y) / this.fullHeight
      const end = this.scrollbarPosition + (percentage / 100) * this.scrollTotal

      const animate = () => {
        time += increment
        this.scrollbarPosition = easeInOutQuad(time, start, end - start, duration)

        if (time < duration) requestAnimationFrame(animate)
      }

      animate()
      this.hide()
    },

    onClick ({ clientY }) {
      const { scrollbar, wrapper } = this.$refs
      const { top, height } = scrollbar.getBoundingClientRect()

      const currentY = clientY - (height / 2)
      const lastY = Math.round(top - (height / 2))
      const y = lastY < currentY ? this.jump : -this.jump

      this.scrollTo(y)
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

    onKeyup ({ code }) {
      if (!isValid(code)) return

      const y = getSrollValues(this.fullHeight)[code]
      const duration = isArrow(code) ? 50 : this.duration

      this.scrollTo(y, duration)
    },

    bindEvents () {
      this.$eventsBinded = [
        bindEvent(window, 'mousemove', this.dragMove), // move
        bindEvent(window, 'resize', this.update), // resize | zoom
        bindEvent(window, 'mouseup', this.dragEnd, { passive: true }), // end
        bindEvent(window, 'wheel', this.onScroll, { passive: true }), // scroll
        bindEvent(window, 'keydown', this.onKeyup, { passive: true }), // up | down | space | etc
        bindEvent(this.$refs.scrollbar, 'mousedown', this.dragStart, { passive: true }) // start
      ]
    },

    unbindEvents () {
      this.$eventsBinded.forEach(unbind => unbind())

      this.mutation.disconnect()
    },

    initMutationObserver (el, content) {
      const callback = mutations => mutations.forEach(this.update)
      this.mutation = new MutationObserver(callback)

      const config = { childList: true, characterData: true }

      this.mutation.observe(content, config)
    }
  },

  beforeDestroy () {
    this.unbindEvents()
  }
}
</script>

<style lang="scss">
@mixin mobile {
  @media only screen and (max-width: 575px) { @content; }
}
@mixin desktop {
  @media only screen and (min-width: 575px) { @content; }
}

.vue-coe-scroll {
  height: 100%;
  position: relative;

  user-select: var(--user-select);

  overflow: hidden;
  @include mobile { overflow: visible; }

  & > .full-scrollbar {
    top: 0;
    right: 0;
    z-index: 2;
    position: fixed;
    transition: opacity 0.5s;
  }

  & > .scrollbar {
    right: 0;
    z-index: 2;
    position: absolute;

    display: block;

    border-radius: 50px;
    border-color: transparent;
    background: linear-gradient(135deg, #BC4CF7, #7873EE);

    transition: opacity 0.5s;
    transform: translateY(var(--position-scroll));

    visibility: visible;
    @include mobile { visibility: hidden; }
  }

  & > .content {
    z-index: 1;

    @include desktop {
      transform: translateY(var(--position-content));
    }
  }
}
</style>
