/**
 * 七彩评价平台相关操作
 * @author 刁梦齐 <diaomeowqi@qq.com>
 * @version 0.0.1
 * @last: 王博 2019-12-7
 */

import request from '@/utils/request'

/**
 * 发送网络请求获取七彩评价管辖学校列表
 *
 * @export
 * @param {areaCode,cityId,provinceId,schoolId} data
 * @returns
 */
export function getSchoolList(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 获取某班级评价积分平均值
 *
 * @export
 * @param {classId,week} data
 * @returns
 */
export function getClassTeaEvaAvg(data) {
  return request({
    url: '/qcpj/subject/getClassTeaEvaAvg',
    method: 'GET',
    params: data
  })
}
