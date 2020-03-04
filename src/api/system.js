/**
 * 七彩评价平台相关操作
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 * @last 刁梦齐 2020-02-21
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
