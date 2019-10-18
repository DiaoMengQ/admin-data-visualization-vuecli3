/** 获取后台传输的token并储存 */
const TokenKey = 'user-token'

// 获取本地保存的Token
export function getToken() {
  // console.log(localStorage.getItem(TokenKey))
  return localStorage.getItem(TokenKey)
}

// 登录成功后将token存储在cookie之中
export function setToken(token) {
  localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(TokenKey) // 清除token
}
