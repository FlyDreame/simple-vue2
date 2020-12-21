export default {
  data() {
    return {
      name: "simple-vue"
    };
  },
  render(createElement) {
    return createElement("div", [
      createElement("input", {
        domProps: {
          value: this.name
        },
        on: {
          input: (event) => {
            this.name = event.target.value;
          }
        }
      }),
      createElement("h2", `hello，${this.name}`)
    ]);
  },
  created() {
    console.log("created!!");
  },
  mounted() {
    console.log("mounted!!");
    window.setTimeout(() => {
      this.name = "simple-vue!!";
    }, 2000);
  }
};
