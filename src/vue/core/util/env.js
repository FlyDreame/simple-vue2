/* 对当前环境的判断 */

// can we use __proto__?
export const hasProto = "__proto__" in {};

// Browser environment sniffing
export const inBrowser = typeof window !== "undefined";
export const inWeex = false; // 不考虑 weex 的情况
export const weexPlatform = false; // 不考虑 weex 的情况
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
export const isIE9 = UA && UA.indexOf("msie 9.0") > 0;
export const isEdge = UA && UA.indexOf("edge/") > 0;
export const isAndroid =
  (UA && UA.indexOf("android") > 0) || weexPlatform === "android";
export const isIOS =
  (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === "ios";
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
export const isPhantomJS = UA && /phantomjs/.test(UA);
export const isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = {}.watch;

export let supportsPassive = false;
if (inBrowser) {
  try {
    const opts = {};
    Object.defineProperty(opts, "passive", {
      get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    }); // https://github.com/facebook/flow/issues/285
    window.addEventListener("test-passive", null, opts);
  } catch (e) {}
}

// 暂不考虑 ssr 的情况
let _isServer = false;
export const isServerRendering = () => {
  return false;
};

// detect devtools
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
export function isNative(Ctor) {
  return typeof Ctor === "function" && /native code/.test(Ctor.toString());
}

export const hasSymbol =
  typeof Symbol !== "undefined" &&
  isNative(Symbol) &&
  typeof Reflect !== "undefined" &&
  isNative(Reflect.ownKeys);

let _Set; // $flow-disable-line
/* istanbul ignore if */ if (typeof Set !== "undefined" && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = class Set {
    constructor() {
      this.set = Object.create(null);
    }
    has(key) {
      return this.set[key] === true;
    }
    add(key) {
      this.set[key] = true;
    }
    clear() {
      this.set = Object.create(null);
    }
  };
}

export { _Set };
