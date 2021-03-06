/**
 * 用户相关请求
 */
import request from '@/utils/request'

/**
 * 冻结账户
 *
 * @export
 * @param {userId} para
 * @returns
 */
export function blockedAccount(data) {
  return request({
    url: '/user/blockedAccount',
    method: 'POST',
    data
  })
}

/**
 * 根据账户ID获取管理员权限范围
 *
 * @export
 * @param {userId} para
 * @returns
 */
export function getUserManaRange(para) {
  return request({
    url: '/auth/getUserManaRange',
    method: 'get',
    params: para
  })
}

/**
 * 管理范围授权
 *
 * @export
 * @param {manaRange,userId} data
 */
export function addAuth(data) {
  return request({
    url: '/auth/addAuth',
    method: 'post',
    data
  })
}

/**
 * 添加管理用户
 *
 * @export
 * @param {user} data
 * @returns
 */
export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

/**
 * 登录，返回个人信息
 *
 * @export
 * @param {username,password} data
 * @returns
 */
/*  注意此处传入的参数名称 data
    要和 request 中 axios 实例中
    transformRequest属性的方法接收的参数名(此处为data)一致
 */
export function req4login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 请求登录管理员账号信息
 *
 * @export
 * @param {userId} para
 * @returns
 */
export function getUserInfo(para) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: para
  })
}

/**
 * 请求用户管辖范围
 *
 * @export
 * @returns
 */
export function getManaRange() {
  return request({
    url: '/auth/getManaRange',
    method: 'POST'
  })
}

/**
 * 请求自己权限级别的管理员列表
 *
 * @export
 * @param {userid} para
 * @returns
 */
export function getAdminList(para) {
  return request({
    url: '/user/myCreateUserInfo',
    method: 'GET',
    params: para
  })
}

/**
 * 修改管理员账户信息
 *
 * @export
 * @param {userId,nickname,tel,sex} data
 * @returns
 */
export function updateAdminInfo(data) {
  return request({
    url: '/user/updateUserInfo',
    method: 'post',
    data
  })
}

/**
 * 刷新token
 *
 * @export
 * @returns
 */
export function updateToken() {
  return request({
    url: '/user/updateToken',
    method: 'post'
  })
}

/**
 * oss生成头像上传表单
 *
 * @export
 * @returns
 */
export function createUploadHeadImgOss() {
  return request({
    url: '/user/createUploadHeadImgOss',
    method: 'GET'
  })
}
