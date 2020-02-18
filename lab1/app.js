
let app = new Vue({
  render (h) {
    return h('div', this.msg)
  },
  data () {
    return {
      msg: 'Hello World'
    }
  }
}).$mount('#app')
