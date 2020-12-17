import { createElement } from "../vdom/create-element";
import VNode, { createEmptyVNode } from "../vdom/vnode";
import {
  emptyObject,
  defineReactive
} from '../util/index'

// 初始化 render 相关
export function initRender(vm) {
  vm._vnode = null; // 根节点
  vm._staticTrees = null; // v-once cached trees
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // 设置 $vnode 为 父节点
  const renderContext = parentVnode && parentVnode.context;

  // TODO: 这里注释了 slot 相关
  // vm.$slots = resolveSlots(options._renderChildren, renderContext)
  // vm.$scopedSlots = emptyObject

  // 给 Vue 实例 绑定了 createElement 方法
  // 对应的属性顺序: tag, data, children, normalizationType, alwaysNormalize
  // 从模板编译的渲染函数使用
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  // 用户手写 render 方法使用的
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

  // // $attrs & $listeners are exposed for easier HOC creation.
  // // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data

  // /* istanbul ignore else */
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}

export let currentRenderingInstance = null; // 当前正在渲染的实例

// for testing only
export function setCurrentRenderingInstance(vm) {
  currentRenderingInstance = vm;
}

export function renderMixin(Vue) {
  // 给 Vue 绑定上渲染方法，例如渲染 v-for 、props、listerner 的
  // installRenderHelpers(Vue.prototype)

  // TODO: 先注释掉
  // Vue.prototype.$nextTick = function (fn) {
  //   return nextTick(fn, this)
  // }

  // 加上 _render 方法， 供内部调用
  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;

    if (_parentVnode) {
      // TODO: 这里注释了 slot 相关
      // vm.$scopedSlots = normalizeScopedSlots(
      //   _parentVnode.data.scopedSlots,
      //   vm.$slots,
      //   vm.$scopedSlots
      // )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    let vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      console.error(e);
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      vnode = vm._vnode;
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };
}
