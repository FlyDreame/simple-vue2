import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from './state'

// 定义 Vue 构造函数
function Vue(options) {
  // 初始化选项
  this._init(options);
}

// 初始化 vue
initMixin(Vue);
// 加上 data 处理的方法，比如 get、set
stateMixin(Vue)
// 给 Vue 的原型上加上一些生命周期的处理方法
lifecycleMixin(Vue);
// 给 Vue 加上 _render，$nextTick 方法
renderMixin(Vue);

export default Vue;
