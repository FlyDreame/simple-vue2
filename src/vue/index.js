import Vue from "core/index";
import { inBrowser } from "core/util/index";
import { mountComponent } from "core/instance/lifecycle";
import { query } from "./utils/index";

Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
