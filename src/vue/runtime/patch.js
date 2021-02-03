/* @flow */

import * as nodeOps from "./node-ops"; // 对 dom节点 的操作方法，可以理解为对 dom 的增删改查
import { createPatchFunction } from "../core/vdom/patch";
import baseModules from "../core/vdom/modules/index"; // ref 和 directives 的定义
import platformModules from "./modules/index"; // 对 dom 属性、事件、class、style等的操作方法

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules); // 合并一下

export const patch = createPatchFunction({ nodeOps, modules }); // 根据参数生成 patch 方法
