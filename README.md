# vue-labs
用于学习Vue源码的各种实验

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
