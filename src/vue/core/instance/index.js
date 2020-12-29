import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from "./state";
import { eventsMixin } from "./events";

// 定义 Vue 构造函数
function Vue(options) {
  // 初始化选项
  this._init(options);
}

// 给 Vue 的原型 加上 _init 方法
initMixin(Vue);
// 给 Vue 的原型 加上 $data、$props、$set、$delete、$watch 等方法
stateMixin(Vue);
// 给 Vue 的原型 加上一些生命周期的处理方法
lifecycleMixin(Vue);
// 给 Vue 的原型 加上 _render，$nextTick 方法
renderMixin(Vue);
// 给 Vue 的原型 加上 $on $once $emit 等 方法
eventsMixin(Vue);

export default Vue;
