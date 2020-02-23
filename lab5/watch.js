var vm = new Vue({
  data: {
    a: 1,
    e: {
      f: {
        g: 1
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('should output 1 2: %d %d', oldVal, val)
    },
    'e.f.g': function (val, oldVal) {
      console.log(`should output 1 3: ${oldVal} ${val}`)
    }
  }
})
vm.a = 2
vm.e.f.g = 3
