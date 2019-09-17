<template>
  <div class="vue-coe-scroll" :style="styles">
    <div v-show="hasScroll && active" class="scrollbar-wrapper">
      <div
        class="full-scrollbar"
        :style="{
          opacity: +showScroll,
          width: fullScrollbarWidth + 'px'
        }"
        @mouseout="hide"
        @mouseover="show"
        @mousedown="onClick"
      />

      <div
        ref="scrollbar"
        class="scrollbar"
        :style="{
          opacity: +showScroll,
          width: scrollbarWidth + 'px',
          height: scrollbarHeight + 'px'
        }"
        @mouseout="hide"
        @mouseover="show"
      />
    </div>

    <div ref="wrapper" class="wrapper" v-on="$listeners">
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

    // default is scroll element container
    // but you might want to see some side-effects on your page to update the scroll
    wrapperSelector: {
      type: String,
      default: 'vue-coe-scroll > .wrapper'
    },

    // MutationObserver API triggers 'update' method for each DOM change
    // to prevent this behavior, it is recommended that you set this delay
    // and avoid unnecessary resources
    initDelay: {
      type: Number,
      default: 0
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

    // scrollbar width base
    width: {
      type: Number,
      default: 10
    },

    color: {
      type: String,
      default: 'rgba(18, 30, 73, 0.2)'
    },

    background: {
      type: String,
      default: 'transparent'
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

      scrollbarRight: 4,        // scrollbar position right
      scrollbarWidth: 0,        // width / zoom
      fullScrollbarWidth: 0,    // width / (8 / zoom)
      scrollbarPosition: 0,

      userSelect: 'auto'        // Prevent selection on drag
    }
  },

  watch: {
    scrollbarPosition (value) {
      if (value <= 0) this.scrollbarPosition = 0
      if (value >= this.scrollTotal) this.scrollbarPosition = this.scrollTotal

      /**
      * Updates scrollTop instead translation.
      * Transformations cause issues on fixed elements like modals.
      *
      * https://stackoverflow.com/questions/15194313/transform3d-not-working-with-position-fixed-children/15256339#15256339
      */
      if (this.active) this.$refs.wrapper.scrollTop = -this.contentPosition
    }
  },

  created () {
    this.$once('hook:mounted', () => {
      this.bindEvents()
      setTimeout(this.initMutationObserver, this.initDelay)
    })

    this.$once('hook:beforeDestroy', () => {
      this.unbindEvents()
      setTimeout(() => this.mutation.disconnect(), this.initDelay)
    })
  },

  computed: {
    styles () {
      return {
        '--user-select': this.userSelect,

        '--position-scroll': this.scrollbarPosition + 'px',

        '--scrollbar-color': this.color,
        '--scrollbar-background': this.background,
        '--scrollbar-right': this.scrollbarRight + 'px'
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
      this.height = this.$el.clientHeight
      this.fullHeight = this.$refs.wrapper.scrollHeight
    },

    update () {
      this.show()
      this.setHeights()

      this.hasScroll = this.fullHeight > this.height

      this.scrollbarRight = 4 / getZoom()
      this.scrollbarWidth = this.width / getZoom()

      this.fullScrollbarWidth = this.scrollbarWidth + (8 / getZoom())

      if (this.scrollbarPosition > this.scrollTotal) this.scrollbarPosition = this.scrollTotal

      this.hide()
    },

    onScroll (e) {
      if (!this.active || !this.hasScroll) return

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
      const { scrollbar } = this.$refs
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
    },

    initMutationObserver (el) {
      const callback = mutations => mutations.forEach(this.update)
      this.mutation = new MutationObserver(callback)

      const el = document.querySelector(this.wrapperSelector)
      const config = { childList: true, subtree: true, characterData: true }

      this.mutation.observe(el, config)
    }
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


  & > .scrollbar-wrapper {
    @include mobile { display: none; }

    & > .full-scrollbar {
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      position: absolute;
      background: var(--scrollbar-background);
      transition: opacity .3s;
    }

    & > .scrollbar {
      right: var(--scrollbar-right);
      z-index: 2;
      position: absolute;

      display: block;

      border-radius: 50px;
      border-color: transparent;
      background: var(--scrollbar-color);

      transition: opacity 0.5s;
      transform: translateY(var(--position-scroll));

      visibility: visible;
      @include mobile { visibility: hidden; }

      &:hover{ opacity: 1 !important; }

      &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(var(--scrollbar-right) * - 1);
        right: calc(var(--scrollbar-right) * - 1);
      }
    }
  }

  & > .wrapper {
    z-index: 1;
    height: 100%;
    overflow: hidden;

    @include mobile { overflow: auto; }
  }
}
</style>
