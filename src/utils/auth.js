/** 获取后台传输的token并储存 */
import Cookies from 'js-cookie'
// eslint-disable-next-line no-unused-vars
import store from '@/store'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  console.info(store)
  return Cookies.get(TokenKey) // 拿到token
}

export function setToken(token) {
  return Cookies.set(TokenKey, token) // 登录成功后将token存储在cookie之中
}

export function removeToken() {
  return Cookies.remove(TokenKey) // 清除token
}
