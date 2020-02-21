/* @flow */

import Vue from 'core/index'
import { mountComponent } from 'core/instance/lifecycle'
import { patch } from './patch'

Vue.prototype.__patch__ = patch

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element
): Component {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }
  return mountComponent(this, el)
}

export default Vue
