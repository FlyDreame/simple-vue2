/* @flow */

import config from '../config'
import { callHook, activateChildComponent } from '../instance/lifecycle'

import {
  warn,
  nextTick,
  devtools,
  inBrowser,
  isIE
} from '../util/index'

export const MAX_UPDATE_COUNT = 100

const queue = [] // 用来存放 watcher 的队列
const activatedChildren = []
let has = {} // 可以当成 Map 结构，存放 queue 中的 watcher.id
let circular = {}
let waiting = false // 若为 true 则等待一下
let flushing = false // 当前是否正在清空队列中
let index = 0 // 当前正在处理的序号

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  // 清空队列
  index = queue.length = activatedChildren.length = 0
  // 清空 Map 
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  // flag 也重置
  waiting = flushing = false
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
export let currentFlushTimestamp = 0

// Async edge case fix requires storing an event listener's attach timestamp.
let getNow  = Date.now

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  const performance = window.performance
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = () => performance.now()
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  // queue.sort((a, b) => a.id - b.id) 对队列做了从小到大的排序，这么做主要有以下要确保以下几点
  // 是为了确保:
  // 1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。
  // 2. 用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。
  // 3. 如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。
  queue.sort((a, b) => a.id - b.id)

  // 不缓存 queue.length 是因为有别的 watchers 可能会在我们正在运行的时候 push 进来
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run() // 执行 run,触发 watcher 注册的回调函数
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated')
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false
  activatedChildren.push(vm)
}

function callActivatedHooks (queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * Push 一个 watcher 到 watcher 队列里.
 * 根据 watcher.id 来判断，重复的 watcher 将直接被忽略 ，除非整个队列清空了
 */
export function queueWatcher (watcher) {
  const id = watcher.id
  // 如果 has 这个 Map 中 不存在该 id，那就进行下一步
  if (has[id] == null) {
    has[id] = true // 存下这个id
    if (!flushing) { // 如果当前没有在清空队列
      queue.push(watcher)
    } else {
      // watcher队列 是按 id 排序的，如果队列正在处理中，那么就把他放在合适的位置，比如队列中有 [1,3,5]，当前要添加的 watcher id 是 2，那么就 添加到 1 和 3 中间。但如果 1,3已经处理完了，比如 index = 1, 那么就插到 5 前面。
      let i = queue.length - 1
      // index 就是当前正在处理到哪个位置
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      // 把当前 watcher 插进去
      queue.splice(i + 1, 0, watcher)
    }
    // 如果 waiting 为 true，那就排队等着吧， waiting 保证了 flushSchedulerQueue 只能运行一个，flushSchedulerQueue 运行完之后，才能运行下一个 flushSchedulerQueue。
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      // flushSchedulerQueue 放到微任务队列去，等待执行
      nextTick(flushSchedulerQueue)
    }
  }
}
