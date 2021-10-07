import { $log } from './logger'

let installed = false

// toast 创建，可以使用 this.$toast 访问 toast
function install (proxyMPX: any) {
  if (installed) return
  installed = true
  proxyMPX.logger = $log
  Object.defineProperty(proxyMPX.prototype, '$logger', {
    get () {
      return $log
    }
  })
}

export default {
  install
}
