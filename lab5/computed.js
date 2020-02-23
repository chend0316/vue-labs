var testComputed = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})

// 如果一切正常，那么应该输出：2 2 4
console.log(testComputed.aPlus)   // => 2
testComputed.aPlus = 3
console.log(testComputed.a)       // => 2
console.log(testComputed.aDouble) // => 4
