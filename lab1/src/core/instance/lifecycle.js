/* @flow */

export let activeInstance: any = null
export let isUpdatingChildComponent: boolean = false

export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}

export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!vm._vnode) {
      // initial render
      // vm.$el是DOM对象
      vm._vnode = vnode
      vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      // vm._vnode是VNode对象
      vm.__patch__(vm._vnode, vnode)
    }
  }
}

export function mountComponent (
  vm: Component,
  el: ?Element
): Component {
  vm.$el = el

  // 每当data变化时，需要重新调用这一行代码
  // 但是本实验还不涉及data响应式，故这里直接调用一次
  vm._update(vm._render())

  return vm
}
