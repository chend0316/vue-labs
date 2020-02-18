/* @flow */

import {
  isReserved
} from '../util/index'

export function initState (vm: Component) {
  vm._watchers = []
  initData(vm)
}

export function stateMixin (Vue: Class<Component>) {
  Object.defineProperty(Vue.prototype, '$data', {
    get () {
      return this._data
    }
  })
}

function proxy (target: Object, sourceKey: string, key: string) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function proxyGetter () {
      return this[sourceKey][key]
    },
    set: function proxySetter (val) {
      this[sourceKey][key] = val
    }
  })
}

function initData (vm: Component) {
  let data

  if (typeof vm.$options.data === 'function') {
    data = vm._data = vm.$options.data.call(vm, vm)  // 第二个vm参数是要作为业务箭头函数的参数
  } else {
    data = vm._data = vm.$options.data || {}
  }
  // proxy data on instance
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (isReserved(key)) continue
    proxy(vm, `_data`, key)
  }
}
