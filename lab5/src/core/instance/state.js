/* @flow */

import {
  isReserved,
  noop,
  isPlainObject
} from '../util/index'
import { observe } from '../observer/index'
import Dep from '../observer/dep'
import Watcher from '../observer/watcher'

export function initState (vm: Component) {
  const opts = vm.$options

  vm._watchers = []
  initData(vm)
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.watch) initWatch(vm, opts.watch)
}

export function stateMixin (Vue: Class<Component>) {
  Object.defineProperty(Vue.prototype, '$data', {
    get () {
      return this._data
    }
  })

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any
  ): Function {
    const vm: Component = this
    const watcher = new Watcher(vm, expOrFn, cb)
    return function unwatchFn () {
      watcher.teardown()
    }
  }
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

function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    watchers[key] = new Watcher(
      vm,
      getter
    )

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  let getter, setter
  if (typeof userDef === 'function') {
    getter = createComputedGetter(key)
    setter = noop
  } else {
    getter = createComputedGetter(key)
    setter = userDef.set || noop
  }
  Object.defineProperty(target, key, { get: getter, set: setter })
}

function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      watcher.evaluate()
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm: Component, methods: Object) {
  for (const key in methods) {
    vm[key] = methods[key]
  }
}

function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
