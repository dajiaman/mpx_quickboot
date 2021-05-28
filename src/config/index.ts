const isDev = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

interface Config {
  // 后端返回成功状态码
  successCode: number;
  // 环境
  env: string | undefined;
  // 接口地址
  apiUrl: string;
}

const config: Config = {
  successCode: 0,
  env: process.env.NODE_ENV as string,
  apiUrl: ''
}

// 根据环境不同，设置不同接口地址
if (isDev) {
  config.apiUrl = '212121'
} else if (isProduction) {
  config.apiUrl = '12121'
}

export default config
