import vue from "vue";

const app = new vue({
  render: (createElement) => {
    return createElement("h1", "hello,simple-vue2");
  }
});

app.$mount("#app");
