/**
 * 表单校验规则
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 */

/**
  * 密码格式校验
  *
  * @export
  * @param {string} pwd
  * @returns {Boolean}
  */
export function validatePassword(pwd) {
  let ifQualified = false
  pwd = pwd.replace(/\s*/g, '') // 去除字符串中的空白
  if (pwd == null || pwd.length < 6 || pwd.length > 20 || pwd.length === '') {
    ifQualified = false
  } else {
    ifQualified = true
  }
  return ifQualified
}
