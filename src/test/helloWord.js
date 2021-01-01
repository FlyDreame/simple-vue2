export default {
  props: {
    changeName: String
  },
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
            this.$emit("change", this.name);
          }
        }
      }),
      createElement("h2", `hello，${this.name}`)
    ]);
  },
  watch: {
    name() {
      console.log("name 被改变");
    }
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
