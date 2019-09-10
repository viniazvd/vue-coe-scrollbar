<template>
  <transition name="c-overlay-fade">
    <div
      v-if="show"
      :class="classes"
      @click="e => $emit('close', e)"
    />
  </transition>
</template>

<script>
/**
 * Overlay component, used to give focus to a fixed element that appears
 * on the screen.
 */
export default {
  name: 'Overlay',

  props: {
    /**
     * Whether to show or not the overlay
     */
    show: {
      type: Boolean,
      default: false
    },

    /**
     * Makes the overlay completely transparent.
     */
    transparent: {
      type: Boolean,
      default: false
    },

    /**
     * Makes the background slightly darker.
     */
    dark: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classes () {
      return [ 'c-overlay',
        {
          '-transparent': this.transparent,
          '-dark': this.dark
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.c-overlay {
  position: fixed;
  z-index: 30;
  left: 0;
  top: 0;

  height: 100vh;
  width: 100vw;
  opacity: 1;

  &:not(.-transparent) { background-color: rgba(0, 0, 0, .5); }

  &.-dark {
    opacity: .9;
    background: black;
  }
}

.c-overlay-fade {
  @at-root {
    #{&}-enter-active,
    #{&}-leave-active {
      transition: opacity .3s ease !important;
    }

    #{&}-enter,
    #{&}-leave-to {
      opacity: 0 !important;
    }
  }
}
</style>
