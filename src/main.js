import vue from "./vue";

import helloWord from "./test/helloWord";

const app = new vue({
  render: (createElement) => {
    return createElement("div", {}, [createElement("helloWord")]);
  },
  components: { helloWord }
});

console.log(vue);

app.$mount("#app");
