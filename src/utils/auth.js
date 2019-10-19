/** token相关处理 */
const TokenKey = 'user-token'
const userIDKey = 'user-id'

// 获取本地保存的Token
export function getToken() {
  // if (localStorage.getItem(TokenKey)) {
  //   console.info('返回本地token：')
  //   console.info(localStorage.getItem(TokenKey))
  // }

  return localStorage.getItem(TokenKey)
}

// 获取本地保存的userID
export function getUserID() {
  return localStorage.getItem(userIDKey)
}

// 登录成功后将token和userid存储在cookie之中
export function setUserInfo(userInfo) {
  // console.log(userInfo)
  localStorage.setItem(TokenKey, userInfo['token'])
  localStorage.setItem(userIDKey, userInfo['userid'])
}

export function removeToken() {
  localStorage.removeItem(TokenKey) // 清除token
}
