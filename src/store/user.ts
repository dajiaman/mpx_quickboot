import { createStore } from '@mpxjs/core'
import { storage } from '@/utils/storage'

const userStore = createStore({
  state: {
    userInfo: storage.get('userInfo')
  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    saveUserInfo (context) {
      context.commit('SET_USER_INFO')
    }
  }
})

export default userStore
