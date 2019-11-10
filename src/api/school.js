import request from '@/utils/request'

/**
 * 请求学校对应年级的班级信息
 *
 * @export
 * @param {schoolId,startGradeId,endGradeId} data
 * @returns
 */
export function getClassInfo(para) {
  console.log('in class request: ', para)
  return request({
    url: '/qcpj/common/getQcpjClasses',
    method: 'GET',
    params: para
  })
}
