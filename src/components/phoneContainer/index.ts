import { createComponent } from '@mpxjs/core'

createComponent({
  data: {
    disabled: false
  },
  methods: {
    getPhoneNumber (e: WechatMiniprogram.ButtonGetPhoneNumber) {
      this.$emit('getphonenumber', {
        // eslint-disable-next-line no-restricted-syntax
        ...e.detail
      })
    }
  }
})
