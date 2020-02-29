/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { extend, mergeOptions } from '../util/index'

export function initExtend (Vue: GlobalAPI) {
  // 每一个构造函数都会对应一个唯一的 cid
  // 除了 Vue 这个构造函数外，其它构造函数都是通过 extend 来创建的
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this

    const name = extendOptions.name || Super.options.name

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    if (name) {
      Sub.options.components[name] = Sub
    }

    return Sub
  }
}
