/**
 * 用户相关请求操作
 */
import request from '@/utils/request'

// 调用发送请求方法并返回数据
export function req4login(data) {
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

// 获取用户管辖范围
export function getManaRange() {
  return request({
    url: '/auth/getManaRange',
    method: 'POST'
  })
}
