import { AuthStep } from './AuthStep'
// import { LoginMode } from './LoginMode'
import { AuthDisplayMode } from './AuthDisplayMode'
import { checkSession, getWxLoginCode } from '@/utils/wx'
import fuseLine from '../decorator/fuse-line'
import { storage } from '@/utils/storage'
import {
  saveAuthToken,
  getAuthToken as getAuthTokenFromStorage,
  removeAuthToken
} from '@/utils/token'

interface UserInfo {
  // 用户身份
  busiIdentity: string;
  // 昵称
  nickname: string;
  // 头像
  headUrl: string;
  // 用户id
  uid: number | string;
  // 手机号
  phone: string;
}

/**
 * 用户登录授权类
 */
export default class SessionLib {
  /**
   * 登录
   * @returns
   */
  public async login ({
    // 是否强行登录
    force = false
  }: {
    force?: boolean;
  } = {}) {
    console.log('Session class login method called')
    if (!force) {
      // 调用wx.checkSession判断session_key是否过期
      const hasSession = await checkSession()

      // 本地已有可用登录态且session_key未过期，resolve。
      if (this.getAuthToken() && hasSession) return Promise.resolve()
    }

    // 发起静默登录
    await this.silentLogin()
  }

  /**
   * 返回自定义登录态
   */
  getAuthToken (): string | undefined {
    return getAuthTokenFromStorage()
  }

  /**
   * 静默登录
   */
  private async silentLogin () {
    console.log('发起静默登录')
    try {
      // 获取临时登录凭证code
      const code = await getWxLoginCode()
      console.log('wx code: ', code)

      // 参考https://juejin.cn/post/6933082931653148680
      // 将code发送给服务端，服务端解析获取 session_key 和 openId
      // 使用openId 登录 或者 创建新用户， 用返回自定义登录态
      // 保存登录信息，如auth-token

      console.log('静默登录成功')
      return Promise.resolve(true)

      // console.log('静默登录失败')
      // return Promise.reject(new Error('模拟静默登录失败'))
    } catch (error) {
      // throw error
      return Promise.reject(error)
    }
  }

  /**
   * 刷新登录态
   */
  @fuseLine({ name: 'refreshLogin' })
  public async refreshLogin () {
    try {
      // 清除 Session
      this.clearSession()

      // 发起静默登录
      await this.silentLogin()
    } catch (error) {
      throw error
    }
  }

  /**
   * 清除 Session
   */
  private clearSession () {
    console.log('清除自定义登录态')
    removeAuthToken()
  }

  /**
   * 确保 session_key 有效性
   *
   */
  public async ensureSessionKey () {
    const hasSession = await checkSession()

    if (!hasSession) {
      console.log('sessionKey 已过期，刷新登录态')
      return this.refreshLogin()
    }

    return Promise.resolve()
  }

  /**
   * 更新用户信息
   * e 为获取的用户信息，包括加密 iv 和 encryData
   */
  public async updateUser (e: any) {
    console.log('updateUser', e)
    await this.ensureSessionKey()

    if (
      e.detail.errMsg === 'getUserProfile:ok' ||
        e.detail.errMsg === 'getUserInfo:ok'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iv, encryptedData } = e.detail
      // 发送 iv, encryptdData 和 session_key 去服务端, 进行用户资料的更新

      const userInfo = {
        phone: '134458',
        busiIdentity: 'MEMBER',
        nickname: '自定义昵称',
        // 头像
        headUrl: 'https://avatar',
        uid: 1
      }

      storage.set('userInfo', userInfo)

      return Promise.resolve(true)
    } else {
      console.debug('取消了用户信息授权')

      return Promise.reject(new Error(e.detail.errMsg))
    }
  }

  /**
   * 绑定手机号
   */
  public async bindPhone (e: WechatMiniprogram.ButtonGetPhoneNumber) {
    console.log('Session class bindPhone method called ', e)
    await this.ensureSessionKey()

    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iv, encryptedData } = e.detail
      // 发送 iv, encryptdData 和 session_key 去服务端

      const userInfo = {
        phone: '134458',
        busiIdentity: 'MEMBER',
        nickname: 'u_3455131',
        // 头像
        headUrl: '',
        uid: 1
      }

      storage.set('userInfo', userInfo)

      const token = 'token123'
      // 更新token 到本地storage
      saveAuthToken(token)

      return Promise.resolve(true)
    } else {
      console.debug('取消了手机号授权')
      return Promise.reject(new Error(e.detail.errMsg))
    }
  }

  /**
   * 授权拦截处理
   * @param param
   * @returns
   */
  public mustAuth ({
    mustAuthStep = AuthStep.THREE,
    popupCompName = 'auth-flow-popup',
    mode = AuthDisplayMode.POPUP
  } = {}): Promise<any> {
    console.log('当前所属阶段', this.getCurrentAuthStep())
    // 当前阶段处于会员态（2）或者会员信息态（3），执行resolve操作
    if (this.getCurrentAuthStep() >= mustAuthStep) return Promise.resolve()

    // 尝试获取当前页面的 <auth-popup id="auth-flow-popup" /> 组件实例
    const pages = getCurrentPages()
    // 页面实例
    const curPage = pages[pages.length - 1]
    const popupComp = curPage.selectComponent(`#${popupCompName}`)
    console.log('popupComp', popupComp)

    // 组件不存在或者显示指定页面，跳转到授权页面
    if (!popupComp || mode === AuthDisplayMode.PAGE) {
      // 当前的路由
      const curRoute = curPage.route

      // 跳转到授权页面，带上当前页面路由，授权完成之后，回到当前页面。
      wx.redirectTo({
        url: `/pages/login/index?backTo=${encodeURIComponent(curRoute)}`
      })
      return Promise.resolve()
    }

    // 设置授权 LEVEL，然后调用 <auth-popup> 的 nextStep 方法，进行进一步的授权。
    popupComp.setMustAuthStep(mustAuthStep)
    popupComp.nextStep()

    // 等待成功回调或者失败回调
    return new Promise((resolve, reject) => {
      const authStatus = getApp().status.auth
      console.log('authStatus', authStatus)
      authStatus.onceSuccess(resolve)
      authStatus.onceFail(reject)
    })
  }

  /**
   * 获取当前授权阶段
   * @returns
   */
  public getCurrentAuthStep (): AuthStep {
    // 切换账号登录的时候，始终返回AuthStepType.ONE
    // const loginMode = this.getLoginMode()
    // if (loginMode === LoginMode.SWITCH_ACCOUNT) return AuthStep.ONE

    // 用户身份定义非会员返回AuthStepType.ONE
    const userInfo = this.getUser()
    if (userInfo?.busiIdentity !== 'MEMBER') return AuthStep.ONE

    // 初次登录，未授权用户信息，返回AuthStepType.TWO
    // 这里定义未授权用户信息前，nickname 为 'u_'开头，可以使用其他的去定义
    if (userInfo.nickname.substring(0, 2) === 'u_' && !userInfo.headUrl) {
      return AuthStep.TWO
    }

    // 都有，返回AuthStepType.THREE
    return AuthStep.THREE
  }

  public getLoginMode () {
    return 1
  }

  /**
   * 获取用户信息
   */
  public getUser (): UserInfo | null {
    return storage.get('userInfo')
  }

  // 是否存在用户信息
  public hasUser (): boolean {
    return !!this.getUser()
  }

  // 是否绑定手机号
  public hasPhone (): boolean {
    return !!this.getUser()?.phone
  }

  /**
   * 解绑手机号
   */
  unbindPhone () {
    // 通过与服务端交互实现
  }

  /**
   * 注销登录
   */
  logout () {
    // 通过与服务端交互实现
    this.clearSession()
  }
}

export const session = new SessionLib()
