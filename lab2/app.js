let d = {
  msg: 'Hello World'
}

let app = new Vue({
  render (h) {
    return h('div', this.msg)
  },
  data () {
    return d
  }
}).$mount('#app')

d.msg = 'Hello Vue'
