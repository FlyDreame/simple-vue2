import vue from "./vue";

import patchDemo from "./test/patchDemo";

const app = new vue({
  render: (createElement) => {
    return createElement("div", {}, [
      createElement("patchDemo")
    ]);
  },
  components: { patchDemo }
});


app.$mount("#app");
