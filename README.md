<h1 align="center">A mpx project</h1>
<p align="center">mpx小程序快速开发模板</p>




## get started

```bash
# install dependencies
npm install

# for dev
npm run watch

# for production environment
npm run build
```

``` bash
# web 调试
npm run watch:web:serve
```

npm script规范 [build|watch]:[dev|prod]:[cross|web|none]

build默认prod，watch默认dev。另单独提供了build:dev和watch:prod，用于单次构建分析看未压缩代码分析问题和持续压缩代码便于大体积项目真机调试。

建议自行调整cross的目标。npm-run-all是为了兼容windows下无法同时执行两个npm script，若不需要转web平台，可考虑去掉。
