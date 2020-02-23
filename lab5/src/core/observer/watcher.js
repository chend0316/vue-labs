/* @flow */

import { pushTarget, popTarget } from './dep'
import { parsePath } from '../util/index'

export default class Watcher {
  vm: Component;
  cb: Function;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;

  constructor (
    vm: Component,
    getter: Function,
    onChange: Function
  ) {
    this.vm = vm
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()

    if (typeof getter === 'function') {
      this.getter = getter
    } else {
      this.getter = parsePath(getter)
    }
    this.cb = onChange

    this.value = this.get()
  }

  update () {
    // 这里做了简化，直接调用this.run()
    // 原版Vue会调用queueWatcher(this)，并执行复杂的调度过程
    this.run()
  }

  run () {
    const newValue = this.get()
    const oldValue = this.value
    this.value = newValue
    if (oldValue !== newValue) {
      this.cb && this.cb.call(this.vm, newValue, oldValue)
    }
  }

  // 两个目的：取值、进行依赖收集
  get () {
    pushTarget(this)
    let value = this.getter.call(this.vm, this.vm)  // computed 可能需要访问 vm 的 data
    popTarget()
    this.cleanupDeps()
    return value
  }

  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  evaluate () {
    this.value = this.get()
  }
}