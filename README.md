# vue-labs
用于学习Vue源码的各种实验

data->vnode的过程是由core/vdom/create-element.js中的`createElement()`实现的。

vnode->node的过程是由core/vdom/patch.js中的`patch()`实现的。

## Lab 路线图
```
(主线) Lab1 --> Lab2 --> Lab5
(支线, 难) Lab2 --> Lab3
(支线, 难) Lab2 --> Lab4 --> 配置合并、组件注册、异步组件
(主线, 编译) Lab5 --> Lab6
```

# 实验内容

## Lab1

* 通过VDOM接口在页面上显示Hello
* 将options中的data映射为vm.data

## Lab2 响应式（Observe）

基本原理：
* 通过`observe(data)`可以创建一个「可观察对象」，即`Observer`对象，该对象会存放在`data.__ob__`字段
* 可观察对象会维护一个`Dep`对象，它的每个字段又会维护一个`Dep`对象
* `Dep`对象内部有一个`subs`数组，用于存放所有「订阅者」，订阅者是`Watcher`对象
* 取数据的同时就注册了一个订阅者
* 可观察对象在数据发生改变的时候会通过`dep.notify()`通知订阅者

业务入侵：
* 相信业务不会使用`data.__ob__`字段
* Vue定义`__ob__`字段的时候使用了`Object.defineProperty`，并将`enumerable`设置为`false`不可遍历，进一步降低了对业务的影响
* Vue为`data`定义getter/setter，业务只需像普通对象那样读写字段即可

Lab2的入口有2个：
* core/instance/state.js中`initData()`时调用了`observe(data)`
* core/instance/lifecycle.js中`mountComponent()`函数内的`new Watcher()`

当业务修改data时，流程如下：
* 执行setter，见core/observer/index.js:defineReactive()
* 调用`dep.notify()`，见core/observer/index.js:defineReactive()
* 调用`Watcher.update()`，Lab2做了简化移除了Scheduler，所以这一步很简单
* 调用`Watcher.get()`，这会调用预留的getter
* 预留的getter是`vm._update(vm._render())`，见core/instance/lifecycle.js:mountComponent()
* 结束

当业务读取data时，就注册了一个订阅者，流程自己分析吧。

Lab2移除了Scheduler，即core/observer/scheduler.js文件，这部分代码以后专门分析。

## Lab3 patchVnode

patch的目的是当dom树改变的时候，避免替换整个节点树，只替换有变动的节点，以提升效率。

Lab3会在core/vdom/patch.js下增加`patchVnode()`，这个Lab涉及到的算法很难理解。后续实验中也不会保留`patchVnode()`代码，如果看不懂也可以跳过，不会影响后续实验。

## Lab4 组件化

假定业务给`createElement()`传入一个组件，如下：
```javascript
let app = new Vue({
  render: h => h(App)
}).$mount('#app')
```

对于一个组件来说
* data->vnode的过程：`createElement()`经过简单的判断马上会将控制权转交给`createComponent()`
* vnode->node的过程：`createElm()`经过简单的判断马上会将控制权转交`createComponent()`

注意这两个`createComponent()`同名但不是同一个函数，分别位于：
* core/vdom/create-component.js
* core/vdom/patch.js

子组件会“继承”父组件，这就需要用到`extend()`方法

每个组件都有cid标识，之前的实验中我们没接触组件，也不需要用到cid，这次实验开始我们需要用到cid。

## Lab5

由于 Lab4 的代码比较多，内容也比较难，可能有同学进度落下了。所以 Lab5 做容易一点的事情，给大家一些的缓冲时间，希望落下进度的同学尽快赶上。

Lab5 要做的是数据相关的周边功能，即实现官方 API 文档中「选项/数据」的部分接口，包括：
* computed
* methods
* watch，这实际上是`vm.$watch()`的语法糖

这些接口的实现都位于core/instance/state.js

## Lab6 编译

在platforms/web/runtime/index.js中已经定义了`Vue.prototype.$mount`，而在platforms/web/entry-runtime-with-compiler.js中会覆盖`Vue.prototype.$mount`的定义。

如果业务没有定义render选项，那么编译器就会发挥作用。编译器会将template编译成render函数。

编译有3个核心步骤：parse、optimize、generate，入口文件为compiler/index.js。
