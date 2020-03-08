/**
 * 阅读海洋平台相关操作
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 * @last 王博 2020-03-08
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

/**
 * 根据学校id，起终点的年级id请求阅读海洋对应学学校的班级信息
 *
 * @export
 * @param {schoolId, startGradeId, endGradeId}
 * @returns
 */
export function getYDHYClassInfo(params) {
  return request({
    url: '/ro/comomon/classInfo',
    method: 'get',
    params
  })
}

/**
 * 根据学校id，起终点的年级id请求阅读海洋对应学学校的班级信息
 *
 * @export
 * @param classId 班级id
 * @returns
 */
export function getReadingMessionByClass(classId) {
  return request({
    url: `/ro/read/classUserTaskStat?classId=${classId}`,
    method: 'get'
  })
}

/**
 * 获取书籍类型
 *
 * @export
 * @param classId 班级id
 * @returns
 */
export function getBookTypes() {
  return request({
    url: `/ro/read/booktype`,
    method: 'get'
  })
}

export function getReadHabitByClass(params) {
  return request({
    url: '/ro/read/classReadHabit',
    method: 'get',
    params
  })
}

export function getSchoolReadingReg(params) {
  return request({
    url: '/ro/read/schoolReadHabitLinReg',
    method: 'get',
    params
  })
}

export function getSchools() {
  return request({
    url: '/ro/comomon/schoolInfo',
    method: 'get'
  })
}
