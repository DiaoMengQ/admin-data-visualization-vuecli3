/**
 * 工具集
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 */

/**
 * 将base64转换为文件
 *
 * @export
 * @param {*} dataurl
 * @param {*} filename
 * @returns
 */
export function Base64toFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

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

// 判断用户名有效
export function validUsername(str) {
  // 这里写用户名判断规则
  return true
}

/**
 * 省份列表
 *
 * @export
 * @returns
 */
export function provinceList() {
  const provinceList = [
    { provinceId: 44, provinceName: '广东' },
    { provinceId: 62, provinceName: '甘肃' },
    { provinceId: 11, provinceName: '北京' },
    { provinceId: 45, provinceName: '广西' },
    { provinceId: 46, provinceName: '海南' },
    { provinceId: 50, provinceName: '重庆' },
    { provinceId: 51, provinceName: '四川' },
    { provinceId: 52, provinceName: '贵州' },
    { provinceId: 53, provinceName: '云南' },
    { provinceId: 54, provinceName: '西藏' },
    { provinceId: 61, provinceName: '陕西' },
    { provinceId: 63, provinceName: '青海' },
    { provinceId: 64, provinceName: '宁夏' },
    { provinceId: 65, provinceName: '新疆' },
    { provinceId: 12, provinceName: '天津' },
    { provinceId: 13, provinceName: '河北' },
    { provinceId: 14, provinceName: '山西' },
    { provinceId: 15, provinceName: '内蒙古' },
    { provinceId: 21, provinceName: '辽宁' },
    { provinceId: 22, provinceName: '吉林' },
    { provinceId: 23, provinceName: '黑龙江' },
    { provinceId: 31, provinceName: '上海' },
    { provinceId: 32, provinceName: '江苏' },
    { provinceId: 33, provinceName: '浙江' },
    { provinceId: 34, provinceName: '安徽' },
    { provinceId: 35, provinceName: '福建' },
    { provinceId: 36, provinceName: '江西' },
    { provinceId: 37, provinceName: '山东' },
    { provinceId: 41, provinceName: '河南' },
    { provinceId: 42, provinceName: '湖北' },
    { provinceId: 43, provinceName: '湖南' }
  ]
  return provinceList
}

/**
 * 年级列表
 *
 * @export
 * @returns
 */
export function gradeList() {
  const gradeList = [
    { gradeId: 1, gradeName: '一年级' },
    { gradeId: 2, gradeName: '二年级' },
    { gradeId: 3, gradeName: '三年级' },
    { gradeId: 4, gradeName: '四年级' },
    { gradeId: 5, gradeName: '五年级' },
    { gradeId: 6, gradeName: '六年级' }
  ]
  return gradeList
}
