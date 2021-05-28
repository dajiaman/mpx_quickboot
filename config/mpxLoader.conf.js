// mpx的loader配置在这里传入
// 配置项文档：https://www.mpxjs.cn/api/compile.html#mpxwebpackplugin-loader
module.exports = {
  loaders: {
    less: [
      'css-loader',
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            strictMath: true
          }
        }
      }
    ]
  }
}
