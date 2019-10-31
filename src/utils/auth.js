/**
 * 本地用户信息存取操作
 * @author 刁梦齐 <diaomeowqi@qq.com>
 * @version 0.0.1
 */

const TokenKey = 'user-token'
const userIDKey = 'user-id'
const userManaRangeKey = 'user-manager-range'

// setter: userid & token
export function setUserInfo(userInfo) {
  localStorage.setItem(TokenKey, userInfo['token'])
  localStorage.setItem(userIDKey, userInfo['userid'])
}

// getter: token
export function getToken() {
  return localStorage.getItem(TokenKey)
}

// getter: userID
export function getUserID() {
  return localStorage.getItem(userIDKey)
}

// setter: 用户权限
export function setUserManaRange(permInfo) {
  // console.log('auth.js/setUserManaRange: ', permInfo)
  localStorage.setItem(userManaRangeKey, permInfo)
}

// clean token
export function removeToken() {
  localStorage.removeItem(TokenKey)
}
