/** 用于api网络请求 */
import request from '@/utils/request'

export function login(data) {
  console.log('api/user.js: 传到api的数据' + data)
  // 调用发送请求方法并返回数据
  return request({
    url: '/user/login',
    // url: 'http://172.20.13.20:8080/user/login',
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
