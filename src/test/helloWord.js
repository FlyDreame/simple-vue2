export default {
  data() {
    return {
      name: "simple-vue"
    };
  },
  render(createElement) {
    return createElement("h1", `hello，${this.name}`);
  },
  created() {
    console.log("created!!");
  },
  mounted() {
    console.log("mounted!!");
  }
};
