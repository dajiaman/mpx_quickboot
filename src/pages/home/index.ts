import mpx, { createPage } from '@mpxjs/core'

import { session } from '@/libs/SessionLib'
import userStore from '@/store/user'

createPage({
  onLoad () {
    console.log('page onLoad')
    const authStatus = getApp().status.auth
    // must 里面会进行状态的判断，例如登录中就等待，登录成功就直接返回，登录失败抛出等。
    authStatus.must(() => {
      console.log('mustAuth 回调', getApp().status.auth)
    })
  },
  computed: {
    userInfo () {
      return userStore.state.userInfo
    }
  },
  methods: {
    tap () {
      mpx.navigateTo({
        url: '/packageTest/pages/request/index'
      })
    },

    bindAuth () {
      session.mustAuth().then(() => {
        console.log('mustAuth 回调', getApp().status.auth)
      })
    },

    goToUcenter () {
      getApp().router.gotoPage('/ucenter')
    }
  },
  onShareAppMessage () {
    return {
      title: '分享标题'
    }
  },
  onShareTimeline () {
    return {
      title: '分享到朋友圈'
    }
  }
})
