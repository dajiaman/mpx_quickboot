import { createPage } from '@mpxjs/core'
import { session } from '@/libs/SessionLib'

createPage({
  data: {
    redirectUrl: ''
  },
  onLoad (options: any) {
    // 授权完成后跳转地址
    const redirectUrl = options.backTo ? decodeURIComponent(options.backTo) : ''
    this.setData({
      redirectUrl: redirectUrl
    })
  },
  methods: {
    // 微信手机号
    phonAuthTap (e: any) {
      console.log('e', e)
      session.bindPhone(e).then(() => {
        console.log('手机号登录成功')
      })
    }
  }
})
