import patchChild from './patchChild'
export default {
  props: {
    changeName: String
  },
  components: {patchChild},
  data() {
    return {
      total: 0,
      clear: false,
      list: []
    };
  },
  render(createElement) {
    const patchChildNodes = this.list.map((value, index) => {
      return createElement("patchChild", {props: {index}, key: index})
    })
    return createElement("div", [
      createElement("input", {
        domProps: {
          value: this.total
        },
        on: {
          blur: (event) => {
            this.total = Number(event.target.value);
            this.list = new Array(this.total).fill('')
          }
        }
      }),
      createElement("button", {
        key: 6666,
        on: {
          click: () => {
            this.list.splice(-1,1)
          }
        }
      }, '清空'),
      ...patchChildNodes
    ]);
  }
};
