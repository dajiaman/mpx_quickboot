import request from './request'

export default class BaseService {
  static testApi () {
    return request.get('www.baidu.com')
  }
}
