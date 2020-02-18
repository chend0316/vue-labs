/* @flow */
import { createElement } from '../vdom/create-element'
import VNode from '../vdom/vnode'

export function initRender (vm: Component) {
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}

export let currentRenderingInstance: Component | null = null

export function renderMixin (Vue: Class<Component>) {
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render } = vm.$options
    let vnode
    
    currentRenderingInstance = vm
    vnode = render.call(vm, vm.$createElement)
    currentRenderingInstance = null
    // 业务render应该只返回一个vnode，如果返回的是长度为1的数组，那么也可以接受
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    if (!(vnode instanceof VNode)) {
      // 业务render有错误，这里用空vnode代替
      vnode = createEmptyVNode()
    }

    return vnode
  }
}
