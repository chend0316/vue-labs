/* @flow */
import { createElement } from '../vdom/create-element'
import VNode, { createEmptyVNode } from '../vdom/vnode'
import { renderHelpersMixin } from './render-helpers/index.js'

export function initRender (vm: Component) {
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d)
}

export function renderMixin (Vue: Class<Component>) {
  renderHelpersMixin(Vue)

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render } = vm.$options

    let vnode
    vnode = render.call(vm, vm.$createElement)
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode()
    }
    return vnode
  }
}
