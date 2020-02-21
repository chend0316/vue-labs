const App = {
  render (h) {
    return h('div', [
      h('p', this.msg),
      h('ul', [
        h('li', 'aaa'),
        h('li', 'bbb'),
        h('li', 'ccc'),
      ]),
    ])
  },
  data () {
    return d
  }
}

let d = {
  msg: 'Hello World'
}

let app = new Vue({
  render: h => h(App)
}).$mount('#app')

d.msg = 'Hello Vue'
