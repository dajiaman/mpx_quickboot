export default function fuseLine ({
  // 一次熔断前重试次数
  tryTimes = 3,

  // 重试间隔，单位 ms
  restoreTime = 5000,

  // 自动冷却阈值，单位 ms
  coolDownThreshold = 1000,

  // 名称
  name = 'unnamed'
}: {
  tryTimes?: number;
  restoreTime?: number;
  name?: string;
  coolDownThreshold?: number;
} = {}) {
  // 请求锁
  let fuseLocked = false

  // 当前重试次数
  let fuseTryTimes = tryTimes

  // 自动冷却
  let coolDownTimer: any

  // 重置保险丝
  const reset = () => {
    fuseLocked = false
    fuseTryTimes = tryTimes
    console.info(`${name}-保险丝重置`)
  }

  const request = async () => {
    if (fuseLocked) throw new Error(`${name}-保险丝已熔断，请稍后重试`)

    // 已达最大重试次数
    if (fuseTryTimes <= 0) {
      fuseLocked = true

      // 重置保险丝
      setTimeout(() => reset(), restoreTime)

      throw new Error(`${name}-保险丝熔断!!`)
    }

    // 自动冷却系统
    if (coolDownTimer) clearTimeout(coolDownTimer)
    coolDownTimer = setTimeout(() => reset(), coolDownThreshold)

    // 允许当前请求通过保险丝，记录 +1
    fuseTryTimes = fuseTryTimes - 1
    console.info(`${name}-通过保险丝(${tryTimes - fuseTryTimes}/${tryTimes})`)
    return Promise.resolve()
  }

  return function (
    _target: Record<string, any>,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) {
    const method = descriptor.value
    descriptor.value = async function (...args: any[]) {
      await request()
      if (method) return method.apply(this, args)
    }
  }
}
