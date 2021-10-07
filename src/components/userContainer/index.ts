import mpx, { createComponent } from '@mpxjs/core'
import { canIUseGetUserProfile } from '@/utils'

createComponent({
  properties: {
    desc: {
      type: String,
      value: '用于完善会员资料'
    }
  },
  data: {
    hasUserInfo: false,
    // 是否可以使用 getUserProfile 的api, 兼容 getUserInfo 和 getUserProfile 2种方式
    canIUseGetUserProfilePermission: false
  },
  ready () {
    if (canIUseGetUserProfile()) {
      this.setData({
        canIUseGetUserProfilePermission: true
      })
    }
  },
  methods: {
    bindGetUserProfile () {
      const that = this

      mpx.getUserProfile({
        desc: that.desc,
        success: (
          res: WechatMiniprogram.GetUserProfileSuccessCallbackResult
        ) => {
          that.$emit('getuserinfo', res)
        }
      })
    },
    bindGetUserInfo (e: WechatMiniprogram.ButtonGetUserInfo) {
      console.log('bindGetUserInfo', e)
      this.setData({
        hasUserInfo: true
      })
      this.$emit('getuserinfo', e.detail)
    }
  }
})
