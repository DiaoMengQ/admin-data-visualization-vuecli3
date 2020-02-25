/**
 * 本地用户信息存取操作(cookie)
 * @author 刁梦齐 <dmq1212@qq.com>
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

// clean token
export function removeToken() {
  localStorage.removeItem(TokenKey)
}

// getter: userID
export function getUserID() {
  return localStorage.getItem(userIDKey)
}

// setter: 用户权限
export function setUserManaRange(roleType, permDetail) {
  switch (roleType) {
    case 'SUPER_ADMIN':
      localStorage.setItem(userManaRangeKey, permDetail)
      break
    default:
      localStorage.setItem(userManaRangeKey, JSON.stringify(permDetail))
      break
  }
}

// getter: 用户权限
export function getUserManaRange(roleType) {
  const manaRange = localStorage.getItem(userManaRangeKey)
  let manaRangeList = []
  switch (roleType) {
    case 'SUPER_ADMIN':
      manaRangeList.push(manaRange)
      break
    case 'CITY_ADMIN':
      manaRangeList = JSON.parse(manaRange)
      break
    case 'SCHOOL_ADMIN':
      manaRangeList = JSON.parse(manaRange)
      break
    default:
      break
  }
  return manaRangeList
}
