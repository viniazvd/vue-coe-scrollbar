<template>
  <div v-if="visible" class='vue-coe-scroll' ref="wrapper">
    <div
      class="full-scrollbar"
      ref="fullscrollbar"
      @click="onClick"
      @mouseover="showScroll = true"
      @mouseout="showScroll = false"
    />

    <div v-show="true" class="scrollbar" ref="scrollbar" />

    <div class="content" ref="content">
      <slot />
    </div>
  </div>

  <div v-else class="vue-coe-scroll" ref="wrapper-default"><slot /></div>
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
    visible: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      lastY: 0,
      events: {},
      mutation: null,
      resizable: null,
      dragging: false,
      showScroll: false
    }
  },

  watch: {
    $route() {
      // TODO
      console.log('wip')
    }
  },

  mounted () {
    if (!this.visible) {
      this.$refs['wrapper-default'].style['overflow'] = 'auto'
      this.$refs['wrapper-default'].style['height'] = '100%'

      return
    }

    // must to be reactive
    this.events = {
      'start': isMobile() ? 'touchstart' : 'mousedown',
      'move': isMobile() ? 'touchmove' : 'mousemove',
      'end': isMobile() ? 'touchend' : 'mouseup'
    }

    const { wrapper: el, content } = this.$refs

    this.setEvents(el)
    this.setResizableObserver(el)
    this.setMutationObserver(el, content)

    this.$refs.fullscrollbar.style.height = el.scrollHeight + 'px'

    if (getComputedStyle(el).webkitOverflowScrolling) this.fixSafari()
  },

  methods: {
    onWheelBoladao (e) {
      this.$el.scrollTop += e.deltaY
    },

    dragStart ({ clientY: currentY, touches }) {
      this.dragging = true
      this.$refs.wrapper.style.pointerEvents = 'none'
      this.$refs.wrapper.style.pointerEvents = 'none'

      this.lastY = currentY !== undefined ? currentY : touches[0].clientY
    },

    dragMove (event) {
      if (!this.dragging) return

      const currentY = event.clientY !== undefined
        ? event.clientY
        : event.touches[0].clientY

      this.$refs.wrapper.scrollTop += (currentY - this.lastY) / this.$refs.scrollbar.scaling
      this.lastY = currentY

      if (!isMobile()) event.preventDefault()
    },

    dragEnd (event) {
      this.dragging = false
      this.$refs.wrapper.style.pointerEvents = 'auto'
      this.$refs.wrapper.style.pointerEvents = 'auto'
    },

    setPosition ({ el, width, height, scrollHeight }) {
      // remove scrollbar
      if (height === scrollHeight) { // sometimes it doesn't work :sad_pepe:
        this.$refs.scrollbar.style.display = 'none'
        return
      }

      this.$refs.scrollbar.style.display = 'block'

      this.$refs.fullscrollbar.style.height = scrollHeight + 'px'

      // calc to config the scrollbar on the right of the screen
      el.style.width = `calc(${ width.toString() + 'px' })`

      const maxScrollTop = scrollHeight - height
      const scrollbarHeight = Math.pow(height, 2) / scrollHeight
      const maxTopOffset = height - scrollbarHeight

      this.$refs.scrollbar.scaling = maxTopOffset / maxScrollTop

      this.$refs.scrollbar.style.height = `${scrollbarHeight}px`

      if (!this.showScroll) {
        setTimeout(() => {
          this.$refs.scrollbar.style.height = `${scrollbarHeight}px`
        }, 3000)
      }

      this.$refs.scrollbar.style.transform = `
        scale(${1 / this.$refs.scrollbar.scaling})
        matrix3d(
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, -1
        )
        translateZ(${-2 + 1 - 1 / this.$refs.scrollbar.scaling}px)
      `
    },

    onClick (event) {
      const scrollbar = this.$refs.wrapper.scrollTop

      if (!scrollbar) {
        this.$refs.wrapper.scrollTop = 700
        this.lastY = event.clientY
        return
      }

      this.$refs.wrapper.scrollTop = this.lastY <= event.clientY
        ? this.$refs.wrapper.scrollTop + 700
        : this.$refs.wrapper.scrollTop - 700

      this.lastY = event.clientY
    },

    setEvents () {
      this.$eventsBinded = [
        bindEvent(this.$el, 'wheel', this.onWheelBoladao),
        bindEvent(window, this.events['move'], this.dragMove),
        bindEvent(window, this.events['end'], this.dragEnd, { passive: true }),
        bindEvent(this.$refs.scrollbar, this.events['start'], this.dragStart, { passive: true })
      ]
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

  beforeDestroy () {
    this.$eventsBinded.forEach(unbind => unbind())

    this.mutation.disconnect()
    this.resizable.disconnect()
  }
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
  right: 0;
  width: 18px;
  position: fixed;
}

.full-scrollbar:hover {
  width: 16px;
  opacity: 0.3;
  background: blue;
}

.scrollbar {
  top: 0px;
  right: 0px;
  width: 15px;
  position: absolute;
  background: blue;
  pointer-events: initial;
  transform-origin: right top;
}
</style>
