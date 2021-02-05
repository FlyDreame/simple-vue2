export default {
  name: 'patchDemo',
  props: {
    index: Number
  },
  data() {
    return {
      name: '哈'
    }
  },
  render(createElement) {
    return createElement("div", this.name + '，我是第' + this.index + '个')
  }
}