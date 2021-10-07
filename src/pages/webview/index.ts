import { createPage } from '@mpxjs/core'

createPage({
  data: {
    url: ''
  },
  onLoad (options) {
    console.log('webview options: ', options)
    this.setData({
      url: options.url ? decodeURIComponent(options.url) : ''
    })
  },
  methods: {
    onReciveMessage (e: any) {
      console.log('event: ', e)
    },
    onWebViewLoad (e: any) {
      console.log('web-view load: ', e)
    },
    onWebViewError (e: any) {
      console.log('web-view error:', e)
    }
  }
})
