/* @flow */

import { initState } from './state'
import { initRender } from './render'
import { mergeOptions } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
  
    vm.$options = mergeOptions(
      vm.constructor.options,
      options || {},
      vm
    )
    vm._renderProxy = vm
    initRender(vm)
    initState(vm)
  }
}
