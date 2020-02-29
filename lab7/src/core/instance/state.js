/* @flow */

import {
  isReserved
} from '../util/index'
import { observe } from '../observer/index'

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

export function proxy (target: Object, sourceKey: string, key: string) {
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
    data = vm._data = vm.$options.data.call(vm, vm)
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
  // lab2: 使data变为可观察对象
  observe(data)
}
