/* @flow */

import { pushTarget, popTarget } from './dep'

export default class Watcher {
  vm: Component;
  cb: Function;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;

  constructor (
    vm: Component,
    fn: Function
  ) {
    this.vm = vm
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    
    this.getter = fn

    this.value = this.get()
  }

  update () {
    // 这里做了简化，直接调用this.run()
    // 原版Vue会调用queueWatcher(this)，并执行复杂的调度过程
    this.run()
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    this.get()
  }

  get () {
    pushTarget(this)
    let value = this.getter.call()
    popTarget()
    this.cleanupDeps()
    return value
  }

  /**
   * Add a dependency to this directive.
   */
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
}