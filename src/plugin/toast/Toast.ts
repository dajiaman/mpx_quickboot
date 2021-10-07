import mpx from '@mpxjs/core'

class Toast {
  defaultOpt: WechatMiniprogram.ShowToastOption = {
    icon: 'none',
    mask: true,
    title: ''
  };

  show (title: string, opt: WechatMiniprogram.ShowToastOption) {
    return mpx.showToast(
      Object.assign(
        {},
        this.defaultOpt,
        {
          title: title
        },
        opt
      )
    )
  }

  success (title: string, opt: WechatMiniprogram.ShowToastOption) {
    return mpx.showToast(
      Object.assign(
        {},
        this.defaultOpt,
        {
          title: title,
          icon: 'success'
        },
        opt
      )
    )
  }

  loading (title: string, opt: WechatMiniprogram.ShowToastOption) {
    // eslint-disable-next-line no-restricted-syntax
    return this.show(title, { icon: 'loading', ...opt })
  }
}

const _toast = new Toast()
const toast = (title: string, opt: WechatMiniprogram.ShowToastOption) => {
  return _toast.show(title, opt)
}

export { toast as default, Toast }
