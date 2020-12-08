import Vue from "./core/index";
import { inBrowser } from "./core/util/index";
import { mountComponent } from "./core/instance/lifecycle";
import { query } from "./utils/index";
import { patch } from "./runtime/patch";

Vue.prototype.__patch__ = patch;

Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

export default Vue;
