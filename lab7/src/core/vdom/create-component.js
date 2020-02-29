/* @flow */

import VNode from './vnode'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isObject
} from '../util/index'

export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // 通过父构造器创建子构造器
  const baseCtor = context.$options._base
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  data = data || {}

  // resolveConstructorOptions(Ctor)

  // 安装钩子函数
  installComponentHooks(data)

  // 实例化组件 VNode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, tag, children }
  )

  return vnode
}

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existingHook = hooks[key]
    const componentHook = componentVNodeHooks[key]
    if (existingHook && existingHook !== componentHook && !existingHook._merged) {
      hooks[key] = mergeHook(componentHook, existingHook)
    } else {
      hooks[key] = componentHook
    }
  }
}

function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}

const componentVNodeHooks = {
  init (vnode: VNodeWithData): ?boolean {
    const child = vnode.componentInstance = createComponentInstanceForVnode(vnode)
    child.$mount(undefined)
  },
}

const hooksToMerge = Object.keys(componentVNodeHooks)

export function createComponentInstanceForVnode (
  vnode: any,
  parent: any,
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
