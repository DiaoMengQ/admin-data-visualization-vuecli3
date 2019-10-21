/** 用于api网络请求 */
import request from '@/utils/request'

export function req4login(data) {
  // 调用发送请求方法并返回数据
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户数据
export function getUserInfo(para) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: para
  })
}

export function getManaRange(data) {
  return request({
    url: '/auth/getManaRange',
    method: 'POST'
  })
}
