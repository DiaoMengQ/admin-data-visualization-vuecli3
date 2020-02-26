/**
 * 阅读海洋平台相关操作
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 * @last 刁梦齐 2020-02-26
 */

import request from '@/utils/request'

/**
 * 根据 {省份和城市 ID 号} 或 {区域代码} 或 {学校ID} 请求阅读海洋学校信息
 *
 * @export
 * @param {areaCode,cityId,provinceId,schoolId} para
 * @returns
 */
export function getYDHYSchoolInfo(para) {
  return request({
    url: '/ro/comomon/schoolInfo',
    method: 'GET',
    params: para
  })
}
