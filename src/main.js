import vue from "./vue";

import helloWord from "./test/helloWord";

const app = new vue({
  render: (createElement) => {
    return createElement("div", {}, [
      createElement("helloWord", {
        on: {
          change: (e) => {
            console.log("改变了：" + e);
          }
        }
      })
    ]);
  },
  components: { helloWord }
});

console.log(app);

app.$mount("#app");
