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
  localStorage.setItem(userManaRangeKey, JSON.stringify(permInfo)) // obj自动存为obj的值的类型字符串，故需手动转为字符串，防止取数据时出错
}

// getter: 用户权限
export function getUserManaRange() {
  return localStorage.getItem(userManaRangeKey)
}

// clean token
export function removeToken() {
  localStorage.removeItem(TokenKey)
}
