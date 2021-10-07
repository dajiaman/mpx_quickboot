
/**
 * 接口返回code 枚举值
 */
export enum ResultEnum {
  // 请求成功时候的code
  SUCCESS = 0,
  // 登录态过期
  AUTH_EXPIRED = 10001,
  // 登录态失效
  AUTH_INVALID = 10002,
  // token 过期时间
  TOKEN_EXPIRE = 10000,
  ERROR = 1,
  TIMEOUT = 401,
}
