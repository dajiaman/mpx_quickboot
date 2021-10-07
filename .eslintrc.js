const { userConf } = require('./config/index')

const eslintConf = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  settings: {
    'html/html-extensions': ['.html', '.mpx'],  // consider .html and .mpx files as HTML
  },
  plugins: [
    'html'
  ],
  globals: {
    wx: true,
    getApp: true,
    App: true,
    __mpx_mode__: true
  },
  rules: {
    camelcase: ['error', { 'allow': ['__mpx_mode__'] }],
  }
}
if (userConf.tsSupport) {
  eslintConf.overrides = [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'standard',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/ban-ts-ignore": "off",

        // since we target ES2015 for baseline support, we need to forbid object
        // rest spread usage (both assign and destructure)
        "no-restricted-syntax": [
          "error",
          "ObjectExpression > SpreadElement",
          "ObjectPattern > RestElement"
        ]
      }
    },
  ]
}

module.exports = eslintConf
