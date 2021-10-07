import { session } from '@/libs/SessionLib'
import { createComponent } from '@mpxjs/core'
import { AuthStep } from '../../libs/AuthStep'

createComponent({
  properties: {
    overlay: {
      type: Boolean,
      value: true
    },
    zIndex: {
      type: Number,
      value: 100
    },
    closeable: Boolean,
    customStyle: String,
    overlayStyle: String,
    closeOnClickOverlay: {
      type: Boolean,
      value: true
    }
  },
  computed: {
    hide () {
      return (
        this.currAuthStep === this.mustAuthStep ||
        this.currAuthStep === AuthStep.THREE
      )
    },

    showOverlay () {
      return this.overlay && !this.hide
    }
  },
  data: {
    AuthStep: AuthStep,
    currAuthStep: 3,
    // 默认情况下，只需要到达阶段二。
    mustAuthStep: AuthStep.TWO
  },
  methods: {
    /**
     * 允许临时更改组件的需要达到的阶段。
     * @param mustAuthStep
     */
    setMustAuthStep (mustAuthStep: AuthStep) {
      this.setData({ mustAuthStep })
    },

    /**
     *  根据用户当前的信息，计算用户处在授权的阶段
     */
    getAuthStep () {
      return session.getCurrentAuthStep()
    },

    updateAuthStep () {
      return this.setData({ currAuthStep: this.getAuthStep() })
    },

    // 发起下一步授权，如果都已经完成，就直接返回成功。
    nextStep (e: any) {
      console.log('nextStep:', e)
      const mustAuthStep = this.mustAuthStep
      const currAuthStep = this.getAuthStep()

      // 已完成授权
      if (currAuthStep >= mustAuthStep || currAuthStep === AuthStep.THREE) {
        // 更新全局的授权状态机，广播消息给订阅者。
        return getApp().status.auth.success()
      }

      // 第一步：更新手机信息
      if (currAuthStep === AuthStep.ONE) {
        // 已有密文信息，更新手机号
        if (e) {
          session.bindPhone(e).then(() => {
            // 更新currentAuthStep
            this.updateAuthStep()
          }).catch((error) => {
            console.log('error', error)
          })
        } else {
          // 未有密文信息，弹出获取窗口
          this.setData({ currAuthStep })
        }
        return
      }

      // 第二步：更新用户信息
      if (currAuthStep === AuthStep.TWO) {
        // 已有密文信息，更新用户信息
        if (e) {
          session.updateUser(e).then(() => {
          // 更新currentAuthStep
            this.updateAuthStep()
          })
        } else {
          // 更新到视图层，展示对应UI，等待获取用户信息
          this.setData({ currAuthStep })
        }
        return
      }

      console.warn('auth.nextStep 错误', { currAuthStep, mustAuthStep })
    },

    /**
     * 点击背景
     */
    onClickOverlay () {
      this.$emit('click-overlay')

      if (this.closeOnClickOverlay) {
        this.$emit('close')
      }
    },

    /**
     * 点击关闭按钮
     */
    onClickCloseIcon () {
      this.$emit('close')
    }
  }
})
