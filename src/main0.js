// 简单的 vue 调用
import vue from "./vue";

const app = new vue({
  render: (createElement) => {
    return createElement("div", "hello，simple-vue!!");
  }
});

app.$mount("#app");
