import { Router } from 'wxapp-router'

const router = new Router()

export const routesConfig = [
  { path: '/login', route: '/pages/login/index' },
  { path: '/home', route: '/pages/home/index' },
  { path: '/ucenter', route: '/pages/ucenter/index' },
  { path: '/webview', route: '/pages/webview/index' }
]

router.batchRegister(routesConfig)

export default router
