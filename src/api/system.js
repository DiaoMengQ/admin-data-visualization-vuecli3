/**
 * 系统数据相关接口
 */
import request from '@/utils/request'

/**
 * 根据省份和城市 ID 号请求地区信息
 * 城市 ID 可选
 * 省份 ID 必填
 *
 * @export
 * @param {city_id,province_id} para
 * @returns
 */
export function getAreaInfo(para) {
  return request({
    url: '/area/get',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取省份统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function QCPJprovDistribution(para) {
  return request({
    url: '/qcpj/log/provinceDistribution',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取区域统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function QCPJcityDistribution(para) {
  return request({
    url: '/qcpj/log/cityDistribution',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取省份统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function YDHYprovDistribution(para) {
  return request({
    url: '/ro/log/provinceDistribution',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取区域统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function YDHYcityDistribution(para) {
  return request({
    url: '/ro/log/cityDistribution',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取访问设备统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function QCPJequipmentCount(para) {
  return request({
    url: '/qcpj/log/equipmentCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取访问设备统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function YDHYequipmentCount(para) {
  return request({
    url: '/ro/log/equipmentCount',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取某日期内的访问浏览器统计信息
 *
 * @export
 * @returns
 */
export function getQCPJbrowserCount(para) {
  return request({
    url: '/qcpj/log/browserCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取某日期内的访问浏览器统计信息
 *
 * @export
 * @returns
 */
export function getYDHYbrowserCount(para) {
  return request({
    url: '/ro/log/browserCount',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取响应状态码统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function QCPJresponseCodeCount(para) {
  return request({
    url: '/qcpj/log/codeCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取响应状态码统计信息
 *
 * @export
 * @param {date} para //若 data 为空则默认为全部
 * @returns
 */
export function YDHYresponseCodeCount(para) {
  return request({
    url: '/ro/log/codeCount',
    method: 'GET',
    params: para
  })
}

/**
 * 根据 {省份和城市 ID 号} 或 {区域代码} 或 {学校ID} 请求所有学校信息
 *
 * @export
 * @param {areaCode,city_id,province_id,schoolId} para
 * @returns
 */
export function getAllSchoolInfo(para) {
  return request({
    url: '/area/getSchoolInfo',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取单天各时段访问统计
 *
 * @export
 * @param {date} para 单天日期 格式:yyyy-MM-dd
 * @returns
 */
export function getQCPJTimeVisitCount(para) {
  return request({
    url: '/qcpj/log/timeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取某时间内的用户日访问统计
 *
 * @export
 * @param {date} para 日期范围
 * @returns
 */
export function getQCPJdayTimeVisitCount(para) {
  return request({
    url: '/qcpj/log/dayTimeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取某时间内的用户月访问统计
 *
 * @export
 * @param {date} para 月份范围
 * @returns
 */
export function getQCPJmonthTimeVisitCount(para) {
  return request({
    url: '/qcpj/log/monthTimeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取单天各时段访问统计
 *
 * @export
 * @param {date} para 单天日期 格式:yyyy-MM-dd
 * @returns
 */
export function getYDHYTimeVisitCount(para) {
  return request({
    url: '/ro/log/timeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取某时间内的用户日访问统计
 *
 * @export
 * @param {date} para 日期范围
 * @returns
 */
export function getYDHYdayTimeVisitCount(para) {
  return request({
    url: '/ro/log/dayTimeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取某时间内的用户月访问统计
 *
 * @export
 * @param {date} para 月份范围
 * @returns
 */
export function getYDHYmonthTimeVisitCount(para) {
  return request({
    url: '/ro/log/monthTimeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取累计访问统计及某日期区间内的访问统计
 *
 * @export
 * @param {date} para 日期范围
 * @returns
 */
export function getQCPJallTimeVisitCount(para) {
  return request({
    url: '/qcpj/log/allTimeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 阅读海洋获取某时间内的用户日访问统计
 *
 * @export
 * @param {date} para 日期范围
 * @returns
 */
export function getYDHYallTimeVisitCount(para) {
  return request({
    url: '/ro/log/allTimeVisitCount',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取分时访问累计平均值
 *
 * @export
 * @returns
 */
export function getQCPJavgTimeVisitCount() {
  return request({
    url: '/qcpj/log/avgTimeVisitCount',
    method: 'GET'
  })
}

/**
 * 阅读海洋获取分时访问累计平均值
 *
 * @export
 * @returns
 */
export function getYDHYavgTimeVisitCount() {
  return request({
    url: '/ro/log/avgTimeVisitCount',
    method: 'GET'
  })
}
