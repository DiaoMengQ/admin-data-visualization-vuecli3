/**
 * 表单验证规则
 * @author 刁梦齐 <dmq1212@qq.com>
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
