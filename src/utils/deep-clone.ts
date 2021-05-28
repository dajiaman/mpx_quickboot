import { isDef } from './validator'

export function deepClone<T extends Record<string, any> | null | undefined> (
  obj: T
): T {
  if (!isDef(obj)) {
    return obj
  }

  if (Array.isArray(obj)) {
    return (obj.map((item) => deepClone(item)) as unknown) as T
  }

  if (typeof obj === 'object' && !isDef(obj)) {
    const to = {} as Record<string, any>
    Object.keys(obj as any).forEach((key) => {
      to[key] = deepClone((obj as any)[key])
    })

    return to as T
  }

  return obj
}
