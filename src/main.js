import vue from "vue";

const app = new vue({
  render: (createElement) => {
    return createElement("h1", "hello,tiny-vue2");
  }
});

app.$mount("#app");
