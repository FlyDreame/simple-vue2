// 简单的 vue 调用
import vue from "./vue";

const app = new vue({
  data() {
    return {
      name: ""
    };
  },
  watch: {
    name(value) {
      console.log(value);
    }
  },
  mounted() {
    window.setTimeout(() => {
      // this.name = "simple-vue";
      for (let i = 0; i <= 1000; i++) {
        this.name = 'simple-vue' + i
      }
    }, 1000);
  },
  render: (createElement) => {
    return createElement("div", "hello，simple-vue!!");
  }
});

app.$mount("#app");
