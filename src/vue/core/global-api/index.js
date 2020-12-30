/* @flow */

import config from "../config";
import { initUse } from "./use";
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import { initAssetRegisters } from "./assets";
import { set, del } from "../observer/index";
import { ASSET_TYPES } from "../../shared/constants";
import builtInComponents from "../components/index";
import { observe } from "../observer/index";

import {
  warn,
  extend,
  // nextTick,
  mergeOptions,
  defineReactive
} from "../util/index";

export function initGlobalAPI(Vue) {
  // config
  const configDef = {};
  configDef.get = () => config;
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  };

  // Vue.set = set
  // Vue.delete = del
  // Vue.nextTick = nextTick

  // 2.6 explicit observable API
  Vue.observable = (obj) => {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue); // 初始化 vue.use 方法
  initMixin(Vue); // 初始化 vue.mixin 方法
  initExtend(Vue); // 初始化 Vue.extend 方法
  initAssetRegisters(Vue); //
}
