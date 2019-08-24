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
      :style="{ opacity: +showScroll }"
      :class="['scrollbar', { '-show-scroll': showScroll }]"
      @mouseover="show"
      @mouseout="hide"
    />

    <div class="content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill'

function isMobile () {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

// ty @vinicius73
function bindEvent (el, event, callback, ...options) {
  el.addEventListener(event, callback, ...options)

  return () => el.removeEventListener(event, callback, ...options)
}

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
      resizable: null,
      dragging: false,
      lastPosition: 0,
      showScroll: true,
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
    this.setResizableObserver(el)
    this.setMutationObserver(el, content)

    this.$refs.fullscrollbar.style.height = el.scrollHeight + 'px'
  },

  methods: {
    onScroll (e) {
      if (!this.active) return

      this.show()
      this.$el.scrollTop += e.deltaY
      this.hide()
    },

    dragStart ({ clientY: currentY, touches }) {
      this.dragging = true
      this.show()

      this.$refs.wrapper.style.pointerEvents = 'none'
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
      this.$refs.wrapper.style.pointerEvents = 'auto'
    },

    setPosition ({ el, width, height, scrollHeight }) {
      console.log({
        wrapper: this.$refs.wrapper.scrollHeight,
        scroll: this.$refs.scrollbar.scrollHeight,
        scrollHeight,
        height
      })

      const { scrollbar, wrapper, fullscrollbar } = this.$refs

      // WIP - sometimes it doesn't work :sad_pepe:
      // remove scrollbar
      if (this.$refs.wrapper.scrollHeight <= this.$refs.scrollbar.scrollHeight) {
        scrollbar.style.display = 'none'
        return
      }

      this.show()

      // // WIP - sometimes it doesn't work :sad_pepe:
      // // remove scrollbar
      // if (height === scrollHeight) {
      //   scrollbar.style.display = 'none'
      //   return
      // }

      scrollbar.style.display = 'block'
      fullscrollbar.style.height = scrollHeight + 'px'

      // calc to config the scrollbar on the right of the screen
      el.style.width = `calc(${ width.toString() + 'px' })`

      const maxScrollTop = scrollHeight - height
      const scrollbarHeight = Math.pow(height, 2) / scrollHeight
      const maxTopOffset = height - scrollbarHeight

      scrollbar.scaling = maxTopOffset / maxScrollTop
      scrollbar.style.height = `${scrollbarHeight}px`
      scrollbar.style.transform = `
        scale(${1 / scrollbar.scaling})
        matrix3d(
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, -1
        )
        translateZ(${-2 + 1 - 1 / scrollbar.scaling}px)
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
        bindEvent(this.$el, 'wheel', this.onScroll),
        bindEvent(window, this.events['move'], this.dragMove),
        bindEvent(window, this.events['end'], this.dragEnd, { passive: true }),
        bindEvent(this.$refs.scrollbar, this.events['start'], this.dragStart, { passive: true })
      ]
    },

    unbindEvents () {
      this.$eventsBinded.forEach(unbind => unbind())

      this.mutation.disconnect()
      this.resizable.disconnect()
    },

    setResizableObserver (el) {
      this.resizable = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { width, height } = entry.contentRect
          this.setPosition({
            el,
            width,
            height,
            scrollHeight: el.scrollHeight
          })
        })
      })

      this.resizable.observe(document.body)
    },

    setMutationObserver (el, content) {
      this.mutation = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          this.setPosition({
            el,
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            scrollHeight: mutations[0].target.scrollHeight
          })
        })
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
  height: 100%;
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

.-show-scroll { opacity: 1; }
</style>
