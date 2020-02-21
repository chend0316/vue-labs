/* @flow */
import Watcher from '../observer/watcher'

export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode) {
    const vm: Component = this
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

  // lab2: 每当data变化时，Watcher都会重新调用一次回调
  new Watcher(vm, () => {
    vm._update(vm._render())
  })

  return vm
}
