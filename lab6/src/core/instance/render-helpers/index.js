/* @flow */

import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
import { renderList } from './render-list'
import { renderSlot } from './render-slot'
import { resolveFilter } from './resolve-filter'
import { checkKeyCodes } from './check-keycodes'
import { bindObjectProps } from './bind-object-props'
import { renderStatic, markOnce } from './render-static'
import { bindObjectListeners } from './bind-object-listeners'
import { resolveScopedSlots } from './resolve-scoped-slots'
import { bindDynamicKeys, prependModifier } from './bind-dynamic-keys'

export function renderHelpersMixin (target: any) {
  target.prototype._o = markOnce
  target.prototype._n = toNumber
  target.prototype._s = toString
  target.prototype._l = renderList
  target.prototype._t = renderSlot
  target.prototype._q = looseEqual
  target.prototype._i = looseIndexOf
  target.prototype._m = renderStatic
  target.prototype._f = resolveFilter
  target.prototype._k = checkKeyCodes
  target.prototype._b = bindObjectProps
  target.prototype._v = createTextVNode
  target.prototype._e = createEmptyVNode
  target.prototype._u = resolveScopedSlots
  target.prototype._g = bindObjectListeners
  target.prototype._d = bindDynamicKeys
  target.prototype._p = prependModifier
}
