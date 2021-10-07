import { storage } from '@/utils/storage'

const TOKEN_KEY = 'authToken'

/**
 * 存储 auth-token
 * @param token
 */
export function saveAuthToken (token: string) {
  storage.set(TOKEN_KEY, token)
}

/**
 * 获取 auth-token
 * @param token
 */
export function getAuthToken (): string | undefined {
  return storage.get(TOKEN_KEY) ? storage.get(TOKEN_KEY) : undefined
}

/**
 * 删除 auth-token
 */
export function removeAuthToken () {
  storage.remove(TOKEN_KEY)
}
