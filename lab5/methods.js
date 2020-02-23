var testMethods = new Vue({
  data: { a: 1 },
  methods: {
    plus: function () {
      this.a++
    }
  }
})

testMethods.plus()
console.log(`should output 2: ${testMethods.a}`)  // 2
