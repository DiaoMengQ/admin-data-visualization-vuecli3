/**
 * 本地用户信息存取操作(cookie)
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 */

// 参考文档: https://www.npmjs.com/package/vue-cookies
import cookies from 'vue-cookies'
cookies.config('120h') // 配置cookie过期时间

const TokenKey = 'user-token'
const userIDKey = 'user-id'
const userManaRangeKey = 'user-manager-range'

// setter: userid & token
export function setUserInfo(userInfo) {
  cookies.set(TokenKey, userInfo['token'])
  cookies.set(userIDKey, userInfo['userid'])
}

// getter: token
export function getToken() {
  return cookies.get(TokenKey)
}

// clean token
export function removeToken() {
  cookies.remove(TokenKey)
  cookies.remove(userIDKey)
  cookies.remove(userManaRangeKey)
}

// getter: userID
export function getUserID() {
  return cookies.get(userIDKey)
}

// setter: 用户权限
export function setUserManaRange(roleType, permDetail) {
  switch (roleType) {
    case 'SUPER_ADMIN':
      cookies.set(userManaRangeKey, permDetail)
      break
    default:
      cookies.set(userManaRangeKey, JSON.stringify(permDetail))
      break
  }
}

// getter: 用户权限
export function getUserManaRange(roleType) {
  const manaRange = cookies.get(userManaRangeKey)
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
