/**
 * 七彩评价平台相关操作
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 * @last:王博 2019-12-7
 */

import request from '@/utils/request'

/**
 * 创建七彩评价科目K-Means聚类分析任务
 *
 * @export
 * @param {classId,k,subjects,taskName,week,remarks} data
 * @returns
 */
export function createSubjectCluster(data) {
  return request({
    url: '/qcpj/subject/createSubjectCluster',
    method: 'POST',
    data
  })
}

/**
 * 根据 {学校ID} 请求学校课程
 *
 * @export
 * @param {schoolId} para
 * @returns
 */
export function getSchoolSubjects(para) {
  return request({
    url: '/qcpj/subject/getSchoolSubjects/' + para,
    method: 'GET'
  })
}

/**
 * 根据 {省份和城市 ID 号} 或 {区域代码} 或 {学校ID} 请求学校信息
 *
 * @export
 * @param {areaCode,city_id,province_id,schoolId} para
 * @returns
 */
export function getSchoolInfo(para) {
  return request({
    url: '/qcpj/common/schoolInfo',
    method: 'GET',
    params: para
  })
}

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
 * 登录,从个人信息中获取七彩评价管辖学校列表
 *
 * @export
 * @param {} data
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

/**
 * 请求学校对应年级的班级信息
 *
 * @export
 * @param {schoolId,startGradeId,endGradeId} data
 * @returns
 */
export function getClassinGrade(para) {
  return request({
    url: '/qcpj/common/getQcpjClasses',
    method: 'GET',
    params: para
  })
}

// 获取该班级中的所有学生
export function getStuinClass(para) {
  return request({
    url: '/qcpj/common/classStudentInfo',
    method: 'GET',
    params: para
  })
}

// 获取该学生的本学期成绩
export function getStuSemester(para) {
  return request({
    url: '/qcpj/subject/getQcpjTeacherEvaStat',
    method: 'GET',
    params: para
  })
}
