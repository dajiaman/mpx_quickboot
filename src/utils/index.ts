import mpx from '@mpxjs/core'

export function canIUseNextTick () {
  return mpx.canIUse('nextTick')
}

// for wx api
export function canIUseGetUserProfile () {
  return !!wx.getUserProfile
}

export function nextTick (cb: (...args: any[]) => void) {
  if (canIUseNextTick()) {
    mpx.nextTick(cb)
  } else {
    setTimeout(() => {
      cb()
    }, 1000 / 30)
  }
}

let systemInfo: WechatMiniprogram.SystemInfo
export function getSystemInfoSync () {
  if (systemInfo == null) {
    systemInfo = mpx.getSystemInfoSync()
  }

  return systemInfo
}

export function requestAnimationFrame (cb: () => void) {
  const systemInfo = getSystemInfoSync()

  if (systemInfo.platform === 'devtools') {
    return setTimeout(() => {
      cb()
    }, 1000 / 30)
  }

  return wx
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(() => {
      cb()
    })
}

export function getRect (
  context: WechatMiniprogram.Component.TrivialInstance,
  selector: string
) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult>(
    (resolve) => {
      mpx.createSelectorQuery()
        .in(context)
        .select(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]))
    }
  )
}

export function getAllRect (
  context: WechatMiniprogram.Component.TrivialInstance,
  selector: string
) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult[]>(
    (resolve) => {
      mpx.createSelectorQuery()
        .in(context)
        .selectAll(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]))
    }
  )
}

/**
 * 获取 currentPage
 * @returns
 */
export function getCurrentPage<T> () {
  const pages = getCurrentPages()
  return pages[pages.length - 1] as T & WechatMiniprogram.Page.TrivialInstance
}
