
let app = new Vue({
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
    return {
      msg: 'Hello World'
    }
  }
}).$mount('#app')
