import request from './request'

export default class BaseService {
  static testApi () {
    return request.get('http://rap2api.taobao.org/app/mock/285207/example/1623411338844', {})
  }

  static testApi2 () {
    return request.get('http://rap2api.taobao.org/app/mock/285207/example/1623411338844?a=1212', {})
  }
}
