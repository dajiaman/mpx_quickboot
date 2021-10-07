import request from './request'

export function wxLogin (code: string) {
  return request.post('/wx/login', {
    data: {
      code: code
    }
  })
}
