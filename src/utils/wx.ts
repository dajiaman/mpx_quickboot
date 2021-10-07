
// 微信方法封装

/**
 * 检查小程序session 是否有效
 * @returns
 */
export function checkSession (): Promise<boolean> {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success (res) {
        if (res.errMsg === 'checkSession:ok') {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail (error) {
        reject(error)
      }
    })
  })
}

/**
 * 获取临时登录凭证code
 * @returns
 */
export function getWxLoginCode () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res: WechatMiniprogram.LoginSuccessCallbackResult) => {
        console.log('wxLogin res:', res)
        if (res.errMsg === 'login:ok') {
          resolve(res.code)
        } else {
          reject(new Error(res.errMsg))
        }
      },
      fail: (error: WechatMiniprogram.GeneralCallbackResult) => {
        reject(error)
      }
    })
  })
}
