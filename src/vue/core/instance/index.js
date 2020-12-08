import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";

// 定义 Vue 构造函数
function Vue(options) {
  // 初始化选项
  this._init(options);
}

// 初始化 vue
initMixin(Vue);
//
lifecycleMixin(Vue);
// 给 Vue 加上 _render，$nextTick 方法
renderMixin(Vue);

export default Vue;
