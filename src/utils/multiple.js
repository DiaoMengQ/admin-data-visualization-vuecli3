/**
 * 工具集
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
 * 获取两日期之间日期列表函数
 *
 * @export
 * @param {string} sDate 开始日期
 * @param {string} eDate 结束日期
 */
export function getMiddleDateList(sDate, eDate) {
  // 初始化日期列表，数组
  const dateList = []
  let i = 0
  // 开始日期小于等于结束日期,并循环
  while (sDate <= eDate) {
    dateList[i] = sDate

    // 获取开始日期时间戳
    const sDate_ts = new Date(sDate).getTime()
    // console.log('当前日期：' + sDate + '当前时间戳：' + sDate_ts)

    // 增加一天时间戳后的日期
    const next_date = sDate_ts + (24 * 60 * 60 * 1000)

    // 拼接年月日，这里的月份会返回（0-11），所以要+1
    const next_dates_y = new Date(next_date).getFullYear() + '-'
    const next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-'
    const next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate()

    sDate = next_dates_y + next_dates_m + next_dates_d

    // 增加数组key
    i++
  }
  // console.log(dateList)
  return dateList
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
