/* @flow */

import Dep from './dep'
import { arrayMethods } from './array'

export function observe(value) {
  let ob
  if (value.hasOwnProperty('__ob__')) {
    ob = value.__ob__
  } else if (
    Array.isArray(value) ||
    Object.prototype.toString.call(value) === '[object Object]'
  ) {
    ob = new Observer(value)
    Object.defineProperty(value, '__ob__', { value: ob, enumerable: false })
  }
  return ob
}

export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * 将每个字段转为getter/setter
   */
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

/**
 * 与dep有关的3行代码是核心代码
 */
export function defineReactive(obj, key, val) {
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)

  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set
  if (arguments.length === 2) {
    val = obj[key]
  }

  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      dep.depend()
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      dep.notify()
    }
  })
}
