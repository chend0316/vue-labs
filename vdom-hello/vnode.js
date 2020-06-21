/**
 * 通过这段代码, 可以理解VNode和Node之间的关系
 */

function isObj(a) {
    return typeof a === 'object' && !Array.isArray(a)
}

class VNode {
    tag
    data
    children
    isComment
    text
    constructor(tag, data, children, text) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
    }
}

function createTextVNode(val) {
    const ret = new VNode()
    ret.text = String(val)
    return ret
}

function createCommentVNode(val) {
    const ret = createTextVNode(val)
    ret.isComment = true
    return ret
}

// createElement('div', 'hello')
// createElement('div', [])
// createElement('div', {class: 'light'})
function createElement(tag, data, childrenOrText) {
    if (arguments.length == 2 && !isObj(data)) {
        childrenOrText = data
        data = undefined
    }
    data = data || {}
    let children = []
    if (Array.isArray(childrenOrText)) {
        children = childrenOrText 
    } else if (typeof childrenOrText === 'string') {
        children = [createTextVNode(childrenOrText)]
    }

    return new VNode(tag, data, children)
}

function createElm(vnode, parentElm) {
    if (vnode.elm) {
        return
    }
    // 创建DOM节点
    if (vnode.tag) {
        vnode.elm = document.createElement(vnode.tag)
    } else if (vnode.isComment) {
        vnode.elm = document.createComment(vnode.text)
    } else {
        vnode.elm = document.createTextNode(vnode.text)
    }
    // 创建子节点
    vnode.children.forEach(child => createElm(child, vnode.elm))
    // 插入DOM父节点
    parentElm.appendChild(vnode.elm)
}

let msg = 'hello'
let list = ['aaa', 'bbb', 'ccc']
// function render (h) {
//     return h('div', [
//         h('p', msg),
//         h('ul', [
//             h('li', 'aaa'),
//             h('li', 'bbb'),
//             h('li', 'ccc'),
//         ]),
//     ])
// 
function render(h) {
    return h('div', [
        h('p', msg),
        h('ul', list.map(v => h('li', v))),
    ])
}
let vnode = render(createElement)
createElm(vnode, document.body)

// msg = 'world'
// let vnode2 = render(createElement)
