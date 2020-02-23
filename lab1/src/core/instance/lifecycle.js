/* @flow */

export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    // 通过 vm._vnode 可以区分是不是第一次 patch
    if (!vm._vnode) {
      vm._vnode = vnode
      vm.__patch__(vm.$el, vnode)
    } else {
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
