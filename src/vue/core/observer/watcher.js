let uid = 0;

export default class Watcher {
  //
  // vm: Component;
  // expression: string;
  // cb: Function;
  // id: number;
  // deep: boolean;
  // user: boolean;
  // lazy: boolean;
  // sync: boolean;
  // dirty: boolean;
  // active: boolean;
  // deps: Array<Dep>;
  // newDeps: Array<Dep>;
  // depIds: SimpleSet;
  // newDepIds: SimpleSet;
  // before: ?Function;
  // getter: Function;
  // value: any;
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;

    this.cb = cb;
    this.id = ++uid; // uid for batching

    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    }

    this.value = this.get();
  }

  /**
   * 执行 getter，重新收集依赖
   */
  get() {
    // pushTarget(this)
    let value;
    const vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        // handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        // traverse(value)
      }
      // popTarget()
      // this.cleanupDeps()
    }
    return value;
  }
}
