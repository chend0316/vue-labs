let d = {
  msg: 'Hello World'
}

let app = new Vue({
  template: `
  <div>
    <p>{{this.msg}}</p>
    <ul>
      <li>aaa</li>
      <li>bbb</li>
      <li>ccc</li>
    </ul>
  </div>
  `,
  data () {
    return d
  }
}).$mount('#app')

d.msg = 'Hello Vue'
