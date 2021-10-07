import mpx from '@mpxjs/core'
import mpxFetch from '@mpxjs/fetch'
import config from '@/config/request'
import { isUrl, isString, isDef } from '@/utils/is'
import { ResultEnum } from './constants'
import { FetchCanceler } from './fetchCanceler'
import { getAuthToken } from '@/utils/token'
import { session } from '@/libs/SessionLib'
mpx.use(mpxFetch)

const fetchCanceler = new FetchCanceler()

// 请求拦截器
mpx.xfetch.interceptors.request.use(
  async request => {
    console.log('request', request)
    // 处理 header undefined
    if (request.header === undefined) {
      request.header = {}
    }

    // 添加token
    if (isDef(getAuthToken()) && isString(getAuthToken())) {
      request['header']['auth-token'] = getAuthToken()
    }

    // 防止并发重复请求
    const cancelToken = new mpx.xfetch.CancelToken()
    request.cancelToken = cancelToken.token
    fetchCanceler.addPending(request, cancelToken)

    // 防止cache, 追加随机参数
    if (request.method === 'GET') {
      request.url = `${request.url}`
      request.params = {
        _t: new Date().getTime()
      }
    }

    // 在请求需要登录态的时候 且 没有登录态
    if (request.needLogin === true && !getAuthToken()) {
      try {
        await session.ensureSessionKey()
      } catch (err) {
        console.error(
          'request interceptors  Session ensureSessionKey function invoke error',
          err
        )
      }

      // 登录成功后，获取 token，通过 headers 传递给后端。
      request['header']['auth-token'] = getAuthToken()
    }

    return request
  },
  error => {
    console.error('Request interceptor Error:', error)
    return Promise.reject(error)
  }
)

// 结果拦截器
mpx.xfetch.interceptors.response.use(
  async response => {
    try {
      // 从队列中移除
      response && fetchCanceler.removePending(response.requestConfig)
      console.log(
        '%c Request Success:',
        'color: #4CAF50; font-weight: bold',
        response
      )
      const res = response.data

      const hasCode = res && Reflect.has(res, 'code')

      if (!hasCode) {
        // it is judged as an error.
        return Promise.reject(new Error('请求错误'))
      }

      //  这里 code，data，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
      const { code, message } = res

      // 登录态过期或失效
      if ([ResultEnum.AUTH_EXPIRED, ResultEnum.AUTH_INVALID].includes(code)) {
        // 刷新登录态
        await session.refreshLogin()

        // 然后重新发起请求
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return request.done(response.requestConfig)
      }

      // 是否请求成功
      const hasSuccess = code === ResultEnum.SUCCESS

      if (hasSuccess) {
        // 成功时返回结果
        return res
      }

      return Promise.reject(new Error(message))
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error(error.message))
    }
  },
  (error: any) => {
    // 隐藏loading
    mpx.hideLoading()
    // for debug
    console.log(
      '%c Request Error:',
      'color: #EC6060; font-weight: bold',
      error
    )

    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误(400)'
          break
        case 401:
          error.message = '未授权,请登录(401)'
          break
        case 403:
          error.message = '拒绝访问(403)'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 405:
          error.message = '请求方法未允许(405)'
          break
        case 408:
          error.message = '请求超时(408)'
          break
        case 500:
          error.message = '服务器内部错误(500)'
          break
        case 501:
          error.message = '服务未实现(501)'
          break
        case 502:
          error.message = '网络错误(502)'
          break
        case 503:
          error.message = '服务不可用(503)'
          break
        case 504:
          error.message = '网络超时(504)'
          break
        case 505:
          error.message = 'HTTP版本不受支持(505)'
          break
        default:
          error.message = `连接错误: ${error.message}`
      }
    } else {
      if (error.toString().indexOf('Network Error') > -1) {
        error.message = '网络异常，请检查后重试！'
      } else if (error.toString().indexOf('timeout') > -1) {
        error.message = '网络超时'
      } else {
        error.message = '服务出错，请联系管理员'
      }
    }
    return Promise.reject(error)
  }
)

type MethodType =
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT'
  | undefined;

interface BaseRequestConfig {
  data?: {
    [key: string]: any;
  };
  params?: {
    [key: string]: any;
  };
  emulateJSON?: boolean;
}

interface RequestConfig extends BaseRequestConfig {
  url: string;
  method?: MethodType;
}

const request = {
  done (requestConfig: RequestConfig): Promise<unknown> {
    // 请求地址
    let requestUrl = ''

    // 兼容处理一下请求地址
    requestUrl =
      requestConfig?.url && isUrl(requestConfig?.url)
        ? requestConfig?.url
        : `${config.apiUrl}${requestConfig?.url}`

    return mpx.xfetch.fetch({
      url: requestUrl,
      method: requestConfig?.method,
      data: requestConfig?.data,
      params: requestConfig?.params,
      emulateJSON: requestConfig?.emulateJSON
    })
  },
  /**
   * post请求
   * @param url
   * @param data 请求的参数
   *
   *
   *
   * BaseRequestConfig 请求参数
   * @param data {Object}
   * @param params {Object}
   * @param emulateJSON ${boolean}
   */
  post (url: string, config: BaseRequestConfig = {}) {
    const requestConfig = Object.assign(
      {
        data: {},
        emulateJSON: false
      },
      config
    )
    return request.done({
      url: url,
      data: requestConfig?.data,
      params: requestConfig.params,
      emulateJSON: requestConfig.emulateJSON,
      method: 'POST'
    })
  },

  /**
   * get请求
   * @param url 请求地址
   * @param config {BaseRequestConfig}请求的参数
   *
   *
   *
   * BaseRequestConfig 请求参数
   * @param data {Object}
   * @param params {Object}
   * @param emulateJSON ${boolean}
   *
   */
  get (url: string, config: BaseRequestConfig = {}) {
    const requestConfig = Object.assign(
      {
        data: {},
        params: {},
        emulateJSON: false
      },
      config
    )

    return request.done({
      url: url,
      data: requestConfig?.data,
      params: requestConfig.params,
      emulateJSON: requestConfig.emulateJSON,
      method: 'GET'
    })
  }
}

export default request
