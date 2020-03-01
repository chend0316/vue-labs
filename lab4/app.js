const ChildComponent = {
  render (h) {
    return h('ul', [
      h('li', 'aaa'),
      h('li', 'bbb'),
      h('li', 'ccc'),
    ])
  }
}

const App = {
  render (h) {
    return h('div', [
      h('p', this.msg),
      h('child-component'),
    ])
  },
  data () {
    return {
      msg: 'Hello Vue'
    }
  },
  components: { ChildComponent }
}

let app = new Vue({
  render: h => h(App)
}).$mount('#app')
