import { Event } from './event'

let installed = false

// toast 创建，可以使用 this.$toast 访问 toast
function install (proxyMPX: any) {
  if (installed) return
  installed = true
  const event = new Event()
  proxyMPX.event = event
  Object.defineProperty(proxyMPX.prototype, '$event', {
    get () {
      return event
    }
  })
}

export default {
  install
}
