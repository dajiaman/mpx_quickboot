import { Toast } from './Toast'

let installed = false

// toast 创建，可以使用 this.$toast 访问 toast
function install (proxyMPX: any) {
  if (installed) return
  const toast = new Toast()
  installed = true
  proxyMPX.toast = toast
  Object.defineProperty(proxyMPX.prototype, '$toast', {
    get () {
      return toast
    }
  })
}

export default {
  install
}
