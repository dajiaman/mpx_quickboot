import mpx from '@mpxjs/core'

/**
 * 判断是否可以使用nextTick 的 api
 * @returns {Boolean}
 */
export function canIUseNextTick () {
  return mpx.canIUse('nextTick')
}

/**
 * 是否可以使用 微信小程序getUserProfile api
 *  @returns {Boolean}
 */
export function canIUseGetUserProfile (): boolean {
  return !!wx.getUserProfile
}

/**
 * nextTick 回调
 * @param {Function} cb 回调函数
 */
export function nextTick (cb: (...args: any[]) => void) {
  if (canIUseNextTick()) {
    mpx.nextTick(cb)
  } else {
    setTimeout(() => {
      cb()
    }, 1000 / 30)
  }
}

/**
 * 获取systemInfo
 * @returns {WechatMiniprogram.SystemInfo|Null} 返回的系统信息
 */
export function getSystemInfoSync (): WechatMiniprogram.SystemInfo | null {
  let systemInfo: WechatMiniprogram.SystemInfo | null = null
  if (systemInfo == null) {
    systemInfo = mpx.getSystemInfoSync()
  }

  return systemInfo
}

/**
 * 帧动画
 * @param {Function} 回调
 * @returns
 */
export function requestAnimationFrame (cb: () => void) {
  const systemInfo = getSystemInfoSync()

  // 环境如果为小程序开发者工具的话，可以模拟实现
  if (systemInfo?.platform === 'devtools') {
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

/**
 * 获取元素的大小尺寸信息
 * @param {WechatMiniprogram.Component.TrivialInstance} 上下文环境
 * @param {String} 选择器
 * @returns
 */
export function getRect (
  context: WechatMiniprogram.Component.TrivialInstance,
  selector: string
) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult>(
    resolve => {
      mpx
        .createSelectorQuery()
        .in(context)
        .select(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]))
    }
  )
}

/**
 * 获取所有符合的元素的尺寸信息
 * @param {WechatMiniprogram.Component.TrivialInstance} 上下文环境
 * @param {String} 选择器，类似dom
 * @returns
 */
export function getAllRect (
  context: WechatMiniprogram.Component.TrivialInstance,
  selector: string
) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult[]>(
    resolve => {
      mpx
        .createSelectorQuery()
        .in(context)
        .selectAll(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]))
    }
  )
}

/**
 * 获取 小程序currentPage
 * @returns
 */
export function getCurrentPage<T> () {
  const pages = getCurrentPages()
  return pages[pages.length - 1] as T & WechatMiniprogram.Page.TrivialInstance
}

/**
 * 实现 badge 样式的console 打印
 * @param label {String} 左边的文字
 * @param value {String} 右边的文字
 * @param labelBgColor {String} 左边的颜色
 * @param valueBgColor {String} 右边的颜色
 */
export function consoleBadge (label: string, value: string, labelBgColor = '#555555', valueBgColor = '#42a91b') {
  console.log('%c '.concat(label, ' %c ').concat(value, ' '), 'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat(labelBgColor, ';'), 'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background:'.concat(valueBgColor, ';'))
}
