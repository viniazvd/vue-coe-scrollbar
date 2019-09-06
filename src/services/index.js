// ty @vinicius73
export function bindEvent (el, event, callback, ...options) {
  el.addEventListener(event, callback, ...options)

  return () => el.removeEventListener(event, callback, ...options)
}

// ty @giseudo
export function easeInOutQuad (time, start, change, duration) {
  time /= duration / 2

  if (time < 1) return change / 2 * time * time + start

  time--

  return -change / 2 * (time * (time - 2) - 1) + start
}

const isBrowser = () => (typeof document !== 'undefined')

// compatibility SSR -ty @vinicius73
export function getZoom () {
  if (!isBrowser) return 1

  return window.devicePixelRatio.toFixed(2)
}

export const getSrollValues = fullHeight => {
  return {
    'Space': 700,
    'ArrowUp': -50,
    'ArrowDown': 50,
    'PageUp': -700,
    'PageDown': 700,
    'End': fullHeight,
    'Home': -fullHeight
  }
}

const scrollOptions = [
  'Space',
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'End',
  'Home'
]

export const isValid = code => scrollOptions.includes(code)
export const isArrow = code => [ 'ArrowUp', 'ArrowDown' ].includes(code)
