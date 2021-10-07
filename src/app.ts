import mpx, { createApp } from '@mpxjs/core'
import apiProxy from '@mpxjs/api-proxy'
import toast from '@/plugin/toast'
import event from '@/plugin/event'
import updater from '@/utils/updater'
import Status from '@/libs/Status'
import { session } from '@/libs/SessionLib'
import { consoleBadge, getSystemInfoSync } from '@/utils'
import { storage } from '@/utils/storage'
import router from '@/routes/index'

// 为mpx添加一个 $emit 的方法, 方便使用
mpx.injectMixins([
  {
    methods: {
      $emit (eventName: string, detail?: Record<string, unknown>) {
        // @ts-ignore
        this.triggerEvent(eventName, detail)
      }
    }
  }
])

mpx.use(apiProxy, { usePromise: true })
mpx.use(toast)
mpx.use(event)

createApp({
  router: router,
  // 公共数据
  globalData: {
    isConnected: true
  },
  status: {
    auth: new Status('auth')
  },
  /**
   * launch 前
   */
  beforeLaunch () {
    consoleBadge('Platform', getSystemInfoSync()?.platform + '')
    // 微信小程序
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (__mpx_mode__ === 'wx') {
      // @ts-ignore
      // console.log('__wxConfig', __wxConfig)
      // develop | trial | release
      // @ts-ignore
      const wxEnvs = {
        develop: '开发版',
        trial: '体验版',
        release: '正式版'
      }
      // @ts-ignore
      const env = wxEnvs[__wxConfig.envVersion] + ''
      // @ts-ignore
      consoleBadge('小程序', env)
    }
    consoleBadge('接口环境', process.env.MODE)
  },
  onLaunch (options) {
    console.debug('App lifecycle launch with options', options)
    // 检查更新
    updater.checkUpdateVersion()

    const that = this
    this.beforeLaunch()

    storage.remove('userInfo')
    storage.remove('authToken')
    // 发起静默登录调用
    session
      .login()
      .then(() => {
        // 把状态机设置为 success
        this.status.auth.success()
        console.log('authStauts', getApp().status.auth)
      })
      .catch(() => {
        // 把状态机设置为 fail
        this.status.auth.fail()
      })

    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    mpx.getNetworkType({
      success (res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          mpx.showToast({
            title: '当前无网络',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })

    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    mpx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        mpx.showToast({
          title: '网络已断开',
          icon: 'error',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        mpx.hideToast()
      }
    })
  },
  onShow (options) {
    console.log('[App lifecycle onShow with options]: ', options)
  },
  onHide () {
    console.log('[App lifecycle onHide]')
  },
  onError (error: string) {
    console.error('[App lifecycle onError]: ', error)
  },
  onUnhandledRejection (res) {
    console.log('[App lifecycle onUnhandledRejection]: ', res)
  },
  onThemeChange (res) {
    console.log('[App method themeChange]', res)
  }
})
