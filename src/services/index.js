// ty @vinicius73
export function bindEvent (el, event, callback, ...options) {
  el.addEventListener(event, callback, ...options)

  return () => el.removeEventListener(event, callback, ...options)
}
