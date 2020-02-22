/* @flow */

import config from '../config'
import VNode, { createEmptyVNode } from './vnode'
import { createComponent } from './create-component'

import {
  isPrimitive
} from '../util/index'

import {
  normalizeChildren
} from './helpers/index'

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any
): VNode | Array<VNode> {
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
    if (config.isReservedTag(tag)) {
      // HTML保留tag
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // Lab4: 组件化
    vnode = createComponent(tag, data, context, children)
  }
  return vnode
}
