/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

import VNode, { cloneVNode } from './vnode'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  makeMap,
  isRegExp,
  isPrimitive
} from '../util/index'

export const emptyNode = new VNode('', {}, [])

export function createPatchFunction (backend) {
  const { modules, nodeOps } = backend

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function removeNode (el) {
    const parent = nodeOps.parentNode(el)
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el)
    }
  }

  /**
   * 根据vnode创建真实DOM节点
   * 
   * DOM API有点怪异：
   * 只有insertBefore和appendChild接口，没有insertAfter接口
   * 而且这两个接口都需要通过parent调用
   */
  function createElm (
    vnode,
    parentElm,
    refElm  // 用于insertBefore
  ) {
    let children = vnode.children
    if (!Array.isArray(children)) {
      children = [children]
    }
    const tag = vnode.tag
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode)
      for (let i = 0; i < children.length; i++) {
        createElm(children[i], vnode.elm, null)
      }
      insert(parentElm, vnode.elm, refElm)
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }

  function removeVnodes (vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        removeNode(ch.elm)
      }
    }
  }

  return function patch (oldVnode, vnode) {

    // DOM接口有nodeType，VNode接口没有nodeType，通过nodeType可以判断是真实DOM元素还是虚拟DOM元素
    // oldVnode有可能是真实dom元素也可能是虚拟vdom元素，vnode一定是vdom元素
    const isRealElement = isDef(oldVnode.nodeType)
    if (isRealElement) {
      // 将dom元素转为vdom元素
      oldVnode = emptyNodeAt(oldVnode)
    }

    // 创建新的 dom 元素，删除旧的，但这样相当于重新创建一整棵 dom 树，效率比较低
    // 为了提升效率，Lab3 会介绍patchVnode
    const oldElm = oldVnode.elm
    const parentElm = nodeOps.parentNode(oldElm)
    createElm(vnode, parentElm, nodeOps.nextSibling(oldElm))
    removeVnodes([oldVnode], 0, 0)

    return vnode.elm
  }
}
