
/**
 * 事件总线
 */
class Eventbus {
  // 存储事件
  private _storage: any

  constructor () {
    this._storage = {}
  }

  // 查找索引
  private findIndex (arr: any[], x: any) {
    return arr.findIndex((item) => item.fn === x)
  };

  /**
   *
   * @param name 监听的自定义事件名
   * @param fn  回调函数
   * @param scope 事件域
   */
  on (name: string, fn: Function, scope?: string) {
    if (Object.prototype.toString.call(this._storage[name]) === '[object Array]') {
      this._storage[name].push({ scope, fn })
    } else {
      this._storage[name] = [{ scope, fn }]
    }
  }

  /**
   *
   * @param name 监听的自定义事件名
   * @param fn  回调函数
   * @param scope 事件域
   */
  once (name: string, fn: Function, scope?: string) {
    const self = this
    const wrapFn = function (payload: any) {
      fn.call(scope, payload)

      self.off(name, wrapFn)
    }

    this.on(name, wrapFn, scope)
  }

  /**
   * 取消事件监听
   * @param name 监听的自定义事件名
   * @param fn 回调函数
   */
  off (name: string, fn: Function) {
    if (this._storage[name]) {
      const i = this.findIndex(this._storage[name], fn)

      if (i !== -1) this._storage[name].splice(i, 1)
    }
  }

  /**
   *
   * @param name 监听的自定义事件名 或者null
   */
  clear (name: string | null) {
    if (name) {
      this._storage[name] = []
    } else {
      this._storage = {}
    }
    return this._storage
  }

  /**
   * @param name 监听的自定义事件名
   * @param payload 回调函数接受的参数
   */
  emit (name: string, payload: any) {
    if (this._storage[name]) {
      this._storage[name].forEach((f: { scope: any; fn: Function}) => f.fn.call(f.scope, payload))
    }
  }
}

const eventbus = new Eventbus()

export {
  eventbus as default,
  eventbus,
  Eventbus
}
