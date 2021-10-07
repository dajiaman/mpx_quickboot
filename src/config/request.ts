interface Config {
  apiUrl: string;
}

type ConfigList = {
  [key: string]: Config;
};

const configList: ConfigList = {
  // 开发环境
  development: {
    apiUrl: 'http://local'
  },
  // 测试环境
  test: {
    apiUrl: ''
  },
  // 预发布环境
  prepare: {
    apiUrl: ''
  },
  // 正式
  production: {
    apiUrl: ''
  }
}

export default configList[process.env.MODE]
