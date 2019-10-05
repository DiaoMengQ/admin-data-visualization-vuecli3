/** 用于api请求 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://172.20.13.20:8080/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://172.20.13.20:8080/user/login',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
