import { extend, mergeOptions, formatComponentName } from "../util/index";
import { initRender } from "./render";
import { initEvents } from "./events";
import { initLifecycle, callHook } from "./lifecycle";
import { initState } from "./state";

// 初始化 Vue 构造函数

// vue 对象的 uuid 通过自增的方式保证不会重复
let uid = 0;

// 提供出去给 Vue 构造函数使用
export function initMixin(Vue) {
  // 给构造函数 Vue.prototype 加上 _init 方法
  Vue.prototype._init = function (options) {
    const vm = this;

    // 通过自增的方式保证不会重复
    vm._uid = uid++;

    // 这个 flag 是为了避免 this 被监听的
    vm._isVue = true;

    // 合并配置
    if (options && options._isComponent) {
      // 如果是组件的话，mergeOptions 已经在 extend 方法中 执行了，此时只需要简单的处理
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }

    vm._renderProxy = vm;

    // 暴露出自己，供内部调用
    vm._self = vm;
    // 给当前对象vm加上 $parent、$root、 $children、$refs等属性，并赋初始值
    initLifecycle(vm);
    // 给当前对象vm加上一些事件相关的属性
    initEvents(vm);
    // 给当前对象vm加上一些渲染相关的属性和方法，例如 $createElement、$slots
    initRender(vm);
    // 执行 beforeCreate 钩子注册的方法
    callHook(vm, "beforeCreate");
    // initInjections(vm) // resolve injections before data/props
    // 将 data 和 props 绑定在 vm._data_ 和 vm._props 上，同时还将 data 和 props 变得响应式
    initState(vm);
    // initProvide(vm) // resolve provide after data/props
    // 执行 created 钩子注册的方法，initState 已调用，此时 created 可以访问 data 和 props了
    callHook(vm, "created");

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

export function initInternalComponent(vm, options) {
  const opts = (vm.$options = Object.create(vm.constructor.options));

  //  这样做是因为它比动态枚举快。
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

export function resolveConstructorOptions(Ctor) {
  let options = Ctor.options;
  debugger;
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super);
    const cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor) {
  let modified;
  const latest = Ctor.options;
  const sealed = Ctor.sealedOptions;
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {};
      modified[key] = latest[key];
    }
  }
  return modified;
}
