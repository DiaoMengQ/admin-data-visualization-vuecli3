/**
 * 工具集
 * @author 刁梦齐 <diaomeowqi@qq.com>
 * @version 0.0.1
 */

/**
 * 判断外部连接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断用户名有效
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // 这里写用户名判断规则
  return true
}

/**
 * 字符串转Json对象
 * @export
 * @param {*} str
 * @returns
 */
export function str2obj(str) {
  return JSON.parse(str)
}