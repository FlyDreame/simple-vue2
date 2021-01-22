export default {
  data() {
    return {
      name: "helloWord Child"
    };
  },
  render(createElement) {
    return createElement("div", '我是 ' + this.name)
  }
}