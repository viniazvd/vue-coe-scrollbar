<template>
  <div v-if="visible" class='vue-coe-scroll' ref="wrapper">
    <div class="full-scrollbar" ref="fullscrollbar" @click="onClick" />
    <div class="scrollbar" ref="scrollbar" />

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
  name: 'example',

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
      dragging: false
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
      el.style.width = `calc(${ width.toString() + 'px' } + 195px)`

      const maxScrollTop = scrollHeight - height
      const scrollbarHeight = Math.pow(height, 2) / scrollHeight
      const maxTopOffset = height - scrollbarHeight

      this.$refs.scrollbar.scaling = maxTopOffset / maxScrollTop
      this.$refs.scrollbar.style.height = `${scrollbarHeight}px`

      // TODO-improve: change to var css
      if (el.isIOS) {
        // calc to remove ios header space
        this.$refs.scrollbar.nextElementSibling.style.marginTop = `-${scrollbarHeight}px`

        const x = 1 / (1 + this.$refs.scrollbar.scaling)

        this.$refs.scrollbar.style.transform = `
          translateZ(${x}px)
          scale(${1 - x})
          translateX(-200px)
        `
      } else {
        this.$refs.scrollbar.style.transform = `
          scale(${1 / this.$refs.scrollbar.scaling})
          matrix3d(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, -1
          )
          translateX(-200px)
          translateZ(${-2 + 1 - 1 / this.$refs.scrollbar.scaling}px)
        `
      }
    },

    onClick (e) {
      console.log(e)
      // const currentY = event.offsetY !== undefined
      //   ? event.offsetY
      //   : event.touches[0].offsetY

      // // const bigger =
      // this.$refs.wrapper.scrollTop = (currentY - this.lastY)
      // this.lastY = currentY
    },

    fixSafari (el) {
      const { wrapper, scrollbar } = this.$refs

      el.isIOS = true

      scrollbar.style.right = ''
      scrollbar.style.left = '100%'
      scrollbar.style.position = '-webkit-sticky'

      wrapper.style.width = ''
      wrapper.style.height = ''
      wrapper.style.position = ''
      wrapper.style.perspective = '1px'

      Array
        .from(el.children)
        .filter(e => e !== wrapper)
        .forEach(e => wrapper.appendChild(e))
    },

    setEvents () {
      this.$eventsBinded = [
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
            scrollHeight: el.scrollHeight
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
  overflow-x: hidden;
  transform-style: preserve-3d;
  perspective-origin: right top;
}

.full-scrollbar {
  width: 18px;
  right: 176px;
  position: fixed;
}

.full-scrollbar:hover {
  width: 18px;
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
