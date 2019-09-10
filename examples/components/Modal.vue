<template>
  <transition appear name="c-modal-fade">
    <div :class="['c-modal', { '-open': isOpened }]" v-if="isOpened">
      <overlay v-if="!noOverlay" show key="overlay" @close="emit" />

      <div :class="classes" key="c-modal">
        <div class="modal">
          <div class="header">
            <div class="title">
              <h1>title</h1>
            </div>

            <div class="actions">
              <button :disabled="disabled" @click="$emit('close')">X</button>
            </div>
          </div>

          <div class="content">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Overlay from './Overlay.vue'

/**
 * Our standard modal component.
 */
export default {
  name: 'Modal',

  components: { Overlay },

  props: {
    /**
     * Whether to show or not the modal.
     */
    isOpened: {
      type: Boolean,
      required: true
    },

    /**
     * Disables the modal actions.
     */
    disabled: Boolean,

    /**
     * Whether to show the background overlay or not.
     */
    noOverlay: Boolean,
  },

  computed: {
    classes () {
      return ['wrapper', `-${this.position}`]
    }
  },

  watch: {
    isOpened (newValue, oldValue) {
      if (newValue === oldValue) return
      this.checkOverflow()
    }
  },

  methods: {
    checkOverflow () {
      this.isOpened ? this.open() : this.close()
    },

    open () {
      const el = document.body
      const styles = { overflow: 'hidden' }

      Object.assign(el.style, styles)
      window.addEventListener('keydown', this.closeOnEsc)
    },

    close () {
      const styles = { overflow: '' }
      const el = document.body

      Object.assign(el.style, styles)
      window.removeEventListener('keydown', this.closeOnEsc)
    },

    emit () {
      /**
       * Emitted when the user either presses the close button, clicks
       * outside the modal window, or presses the ESC key.
       * @event
       */
      this.$emit('close')
      this.close()
    },

    closeOnEsc (ev) {
      if (ev.keyCode === 27) this.emit()
    },

    onClickOutside () {
      if (this.noOverlay) this.emit()
    }
  },

  mounted () {
    this.checkOverflow()
  },

  beforeDestroy () {
    this.close()
    window.removeEventListener('keydown', this.closeOnEsc)
  }
}
</script>

<style lang="scss">
.c-modal.-open {
  position: fixed;
  top: 0px;
  left: 0px;

  width: 100vw;
  height: 100%;

  z-index: 50;
}

.c-modal > .wrapper {
  position: fixed;
  z-index: 50;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  &.-right > .modal { align-self: flex-end; }
  &.-left > .modal { align-self: flex-start; }
  &.-center, &.-bottom { align-items: center; }

  &:before,
  &:after {
    content: "";
    flex: 0 0 80px;
  }

  & > .modal {
    display: flex;
    position: relative;
    flex-shrink: 0;
    flex-direction: column;
    z-index: 30;
    opacity: 1;
    max-width: 100%;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
    background:linear-gradient(180deg, #FFF, rgba(255, 255, 255, .83) 100%);

    border-radius: 5px;
    width: 100%;
    min-height: 250px;
    max-width: 580px;
    margin: 0 auto;

    & > .header {
      display: flex;
      align-items: flex-start;
      flex-shrink: 0;

      padding: 20px 20px 15px;

      & > .title {
        margin-right: auto;

        & > .c-title > .text { color: black; opacity: 0.5; }
      }

      & > .actions {
        display: flex;
        align-items: center;

        margin-left: auto;

        & > a:not(:last-child),
        & > button:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    & > .content {
      width: 100%;
      padding: 5px 20px 50px;
    }
  }
}


/**
 * Transition
 * ----------
 */

.c-modal-fade {
  &-enter-active,
  &-leave-active {
    transition: opacity .5s;

    & > .wrapper > .modal { transition: transform .5s, opacity 350ms; }
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    & > .wrapper {
      & > .modal { opacity: 0; }
      &.-right > .modal { transform: translateX(100%); }
      &.-left > .modal { transform: translateX(-100%); }
      &.-bottom > .modal { transform: translateY(100%); }
      &:not(.-right, .-left) > .modal { transform: scale(0.3); }
    }
  }
}
</style>
