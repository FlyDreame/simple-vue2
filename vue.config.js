let path = require("path");
module.exports = {
  configureWebpack: {
    resolve: {
      // 使用path将相对路径转化为绝对路径
      alias: {
        core: path.resolve("./", "src/vue/core"),
        shared: path.resolve("./", "src/vue/shared"),
        web: path.resolve("./", "src/vue/runtime")
      }
    }
  }
};
