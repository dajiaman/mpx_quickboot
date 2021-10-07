
let pendingMap = new Map<string, any>()

export const getPendingUrl = (config: any) => [config.method, config.url].join('&')

/**
 * 取消重复请求
 */
export class FetchCanceler {
  /**
   * Add request
   * @param {Object} config
   */
  addPending (config: any, cancelToken: any) {
    this.removePending(config)
    const url = getPendingUrl(config)
    if (!pendingMap.has(url)) {
      pendingMap.set(url, cancelToken)
    }
  }

  /**
   * @description: Clear all pending
   */
  removeAllPending () {
    pendingMap.forEach((cancelToken) => {
      cancelToken && cancelToken.exec()
    })
    pendingMap.clear()
  }

  /**
   * Removal request
   * @param {Object} config
   */
  removePending (config: any) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancelToken = pendingMap.get(url)
      cancelToken && cancelToken.exec('手动取消请求')
      pendingMap.delete(url)
    }
  }

  /**
   * @description: reset
   */
  reset (): void {
    pendingMap = new Map<string, any>()
  }
}
