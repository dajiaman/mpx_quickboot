/**
 * 小程序更新管理器
 */
export default class Updater {
  /**
  * 检测当前的小程序
  * 是否是最新版本，是否需要下载、更新
  */
  public static checkUpdateVersion () {
    const self = this
    // 判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      const updateManager: WechatMiniprogram.UpdateManager = wx.getUpdateManager()
      // 检测版本更新
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            // 是否显示取消更新操作
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                self.downloadAndUpdate(updateManager)
              } else if (res.cancel) {
                // 用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示',
                  content: '取消更新可能导致功能不能正常使用，请及时更新',
                  showCancel: false,
                  confirmText: '确定更新',
                  success: function (res) {
                    if (res.confirm) {
                      // 下载新版本，并重新应用
                      self.downloadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '溫馨提示',
        content:
          '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }

  /**
   * 下载更新
   * @param updateManager
   */
  static downloadAndUpdate (updateManager: WechatMiniprogram.UpdateManager) {
    wx.showLoading({
      title: '下载更新中...'
    })
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      // 重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
      wx.hideLoading()
      // 新版本下载失败
      wx.showModal({
        title: '更新失败',
        content: '请您删除小程序，然后重新搜索进入'
      })
    })
  }
}
