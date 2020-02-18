/* @flow */

export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
}
