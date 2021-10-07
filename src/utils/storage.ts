import mpx from '@mpxjs/core'

/**
 * storage 封装类
 */
export default class Storage {
  /**
   * 同步的缓存数据到storage。
   * @param key 键名
   * @param value 值
   * @returns
   */
  set (key: string, value: any) {
    let ret = true
    try {
      mpx.setStorageSync(key, JSON.stringify(value))
    } catch (e) {
      console.error(e)
      ret = false
    }
    return ret
  }

  /**
   * 同步的获取缓存数据。
   * @param key 键名
   * @returns
   */
  get (key: string) {
    let ret
    try {
      ret = mpx.getStorageSync(key)
      ret = ret === '' || ret == null ? null : JSON.parse(ret)
    } catch (e) {
      console.error(e)
    }

    return ret
  }

  /**
   * 清除指定key的缓存数据。
   * @param key 键名
   * @returns
   */
  remove (key: string) {
    try {
      mpx.removeStorageSync(key)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 清除所有的缓存数据
   * @returns
   */
  clear () {
    try {
      mpx.clearStorageSync()
    } catch (e) {
      console.error(e)
    }
  }
}

export const storage = new Storage()
