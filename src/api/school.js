import request from '@/utils/request'

/**
 * 请求学校对应年级的班级信息
 *
 * @export
 * @param {schoolId,startGradeId,endGradeId} data
 * @returns
 */
export function getClassInfo(data) {
  console.log(data)
  return request({
    url: '/qcpj/common/getQcpjClasses',
    method: 'GET',
    data
  })
}
