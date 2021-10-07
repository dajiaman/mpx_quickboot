const toString = Object.prototype.toString

export function is (val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isString (val: unknown): val is string {
  return is(val, 'String')
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction (val: unknown): val is Function {
  return typeof val === 'function'
}

export function isPlainObject (val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

export function isPromise<T = unknown> (val: unknown): val is Promise<T> {
  return isPlainObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isDef (value: unknown): boolean {
  return value !== undefined && value !== null
}

export function isObj (x: unknown): x is Record<string, unknown> {
  const type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

export function isNumber (value: string) {
  return /^\d+(\.\d+)?$/.test(value)
}

export function isBoolean (value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isImageUrl (url: string): boolean {
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i
  return IMAGE_REGEXP.test(url)
}

export function isVideoUrl (url: string): boolean {
  const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i
  return VIDEO_REGEXP.test(url)
}

/**
 * 是否 合法url
 * @param path
 * @returns
 */
export function isUrl (path: string): boolean {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/**
 * 手机号
 * @param path
 * @returns
 */
export function isMobile (path: string): boolean {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  return reg.test(path)
}
