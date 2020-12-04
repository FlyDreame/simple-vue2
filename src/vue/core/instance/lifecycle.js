import { warn, noop } from "../util/index";
import Watcher from "../observer/watcher";

export function mountComponent(vm, el, hydrating) {
  vm.$el = el;

  callHook(vm, "beforeMount");

  // 定义 updateComponent 函数
  let updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // TODO: 先注释掉
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      }
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}

// 调用
export function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  // pushTarget()
  // const handlers = vm.$options[hook]
  // const info = `${hook} hook`
  // if (handlers) {
  //   for (let i = 0, j = handlers.length; i < j; i++) {
  //     invokeWithErrorHandling(handlers[i], vm, null, vm, info)
  //   }
  // }
  // if (vm._hasHookEvent) {
  //   vm.$emit('hook:' + hook)
  // }
  // popTarget()
}
