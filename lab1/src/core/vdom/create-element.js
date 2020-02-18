/* @flow */

import VNode, { createEmptyVNode } from './vnode'

import {
  isPrimitive
} from '../util/index'

import {
  normalizeChildren
} from './helpers/index'

export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any
): VNode | Array<VNode> {
  // 如果少给了1个参数，就意味着省略了data
  // 此时children是第3个参数，而data参数为空
  if (Array.isArray(data) || isPrimitive(data)) {
    children = data
    data = undefined
  }
  return _createElement(context, tag, data, children)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any
): VNode | Array<VNode> {
  if (!tag) {
    return createEmptyVNode()
  }

  children = normalizeChildren(children)

  let vnode
  if (typeof tag === 'string') {
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
  return vnode
}
