/* eslint-disable @typescript-eslint/no-explicit-any */
import mpx from '@mpxjs/core'
import mpxFetch from '@mpxjs/fetch'
import config from '../config/index'

mpx.use(mpxFetch)

// 请求拦截器
mpx.xfetch.interceptors.request.use(
  config => {
    // 处理 header undefined
    if (config.header === undefined) {
      config.header = {}
    }
    config['header']['PowerBy'] = 'mpx'

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

mpx.xfetch.interceptors.response.use(
  response => {
    const res = response.data

    // it is judged as an error.
    if (res.code !== config.successCode) {
      // 根据情况修改
      return Promise.reject(new Error(res.message))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
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

const request = {
  done (
    url: string,
    data: any = {},
    type: MethodType = 'GET',
    emulateJSON: boolean
  ): Promise<unknown> {
    const requestUrl =
      url.indexOf('https') === -1 && url.indexOf('http') === -1
        ? config.apiUrl + url
        : url

    return mpx.xfetch.fetch({
      url: requestUrl,
      method: type,
      data: data,
      emulateJSON: emulateJSON
    })
  },
  /**
   * post请求
   * @param url
   * @param data 请求的参数
   * @param emulateJSON  header是否为json
   * @returns
   */
  post (url: string, data: any = {}, emulateJSON = false) {
    return request.done(url, data, 'POST', emulateJSON)
  },

  /**
   * get请求
   * @param url 请求地址
   * @param data 请求的参数
   * @param emulateJSON  emulateJSON = true 相当于 {'content-type': 'application/x-www-form-urlencoded'}
   * @returns
   */
  get (url: string, data: any = {}, emulateJSON = false) {
    return request.done(url, data, 'GET', emulateJSON)
  }
}

export default request
