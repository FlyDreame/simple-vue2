import { initMixin } from "./init";

// 定义 Vue 构造函数
function Vue(options) {
  // 初始化选项
  this._init(options);
}

// 给 vue
initMixin(Vue);

export default Vue;
