/**
 * 用户相关请求操作，发送网络请求
 * @author 刁梦齐 <diaomeowqi@qq.com>
 * @version 0.0.1
 */
import request from '@/utils/request'

// 登录，返回个人信息
export function req4login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 请求用户数据
export function getUserInfo(para) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: para
  })
}

// 请求用户管辖范围
export function getManaRange() {
  return request({
    url: '/auth/getManaRange',
    method: 'POST'
  })
}
