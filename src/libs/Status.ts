// @ts-nocheck
import mpx from '@mpxjs/core'

/**
 * 状态机
 */
export default class Status {
  status: number;

  statusVar: {
    [key: string]: number;
  };

  name: string;

  // @ts-ignore
  constructor (name: string) {
    this.name = name
    this.statusVar = {
      FAIL: -1,
      UN_START: 0,
      ING: 1,
      SUCCESS: 2
    }
    this.status = this.statusVar.UN_START
  }

  // 改变状态：成功
  success (params?: any) {
    console.log('status:success', `状态器(${this.name}) 启动成功`)
    this.status = this.statusVar.SUCCESS
    mpx.event.emit(this.getEventKeyByStatus(this.statusVar.SUCCESS), params)
  }

  // 改变状态：失败
  fail (error?: any) {
    console.log('status:fail', `状态器(${this.name}) 启动失败`)
    this.status = this.statusVar.FAIL
    mpx.event.emit(
      this.getEventKeyByStatus(this.statusVar.FAIL),
      error
    )
  }

  // 改变状态：进行中
  ing () {
    this.status = this.statusVar.ING
  }

  // 改变状态：重置
  reset () {
    this.status = this.statusVar.UN_START
  }

  // 一定是成功之后，才会返回。
  must (): Promise<any> {
    if (this.status === this.statusVar.SUCCESS) return Promise.resolve()
    return Promise
      .resolve()
      .then(() => new Promise((resolve, reject) => {
        mpx.event.once(this.getEventKeyByStatus(this.statusVar.SUCCESS), resolve)
        mpx.event.once(this.getEventKeyByStatus(this.statusVar.FAIL), reject)
      }))
      .catch(() => {
        return this.must()
      })
  }

  // 监听后续的一次成功事件
  onceSuccess () {
    return new Promise((resolve) => {
      mpx.event.once(this.getEventKeyByStatus(this.statusVar.SUCCESS), resolve)
    })
  }

  // 监听后续的一次失败事件
  onceFail () {
    return new Promise((resolve) => {
      mpx.event.once(this.getEventKeyByStatus(this.statusVar.FAIL), resolve)
    })
  }

  // 是否在进行中
  isIng () {
    return this.status === this.statusVar.ING
  }

  // 是否已经成功
  isSuccess () {
    return this.status === this.statusVar.SUCCESS
  }

  // 是否已经失败
  isFail () {
    return this.status === this.statusVar.FAIL
  }

  // 获取状态器的 key
  getEventKeyByStatus (status: number): string {
    return `${this.name}:${status}`
  }
}
