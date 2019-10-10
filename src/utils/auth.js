/** 获取后台传输的token并储存 */
const TokenKey = 'user-token'

export function getToken() {
  console.log(localStorage.getItem(TokenKey))
  return localStorage.getItem(TokenKey) // 拿token
}

export function setToken(token) {
  // console.log(token)
  return localStorage.setItem(TokenKey, token) // 登录成功后将token存储在cookie之中
}

export function removeToken() {
  return localStorage.removeItem(TokenKey) // 清除token
}
