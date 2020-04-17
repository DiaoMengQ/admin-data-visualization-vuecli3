/**
 * 七彩评价平台相关操作
 */

import request from '@/utils/request'

/**
 * 获取七彩评价科目K-Means聚类分析任务详情
 *
 * @export
 * @param {id} para
 * @returns
 */
export function getSubjectClusterDetail(para) {
  return request({
    url: '/qcpj/subject/getSubjectClusterDetail/' + para,
    method: 'GET'
  })
}

/**
 * 获取七彩评价科目K-Means聚类分析任务列表
 *
 * @export
 * @param {curStatus,endTime,startTime} para
 * @returns
 */
export function getSubjectClusterList(para) {
  return request({
    url: '/qcpj/subject/getSubjectClusterList',
    method: 'GET',
    params: para
  })
}

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
 * 根据 {省份和城市 ID 号} 或 {区域代码} 或 {学校ID} 请求七彩评价学校信息
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

/**
 * 获取该班级中的所有学生
 *
 * @export
 * @param {*} para
 * @returns
 */
export function getStuinClass(para) {
  return request({
    url: '/qcpj/common/classStudentInfo',
    method: 'GET',
    params: para
  })
}

/**
 * 获取某学生的老师评价科目积分(成绩)
 *
 * @export
 * @param {studentId,week} para // week: 从第一周到指定周次
 * @returns
 */
export function getStuSemester(para) {
  return request({
    url: '/qcpj/subject/getQcpjTeacherEvaStat',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取班级老师评价科目线性回归接口
 *
 * @export
 * @param {*} para
 * @returns
 */
export function classSubLinearRegress(para) {
  return request({
    url: '/qcpj/subject/classSubLinearRegress',
    method: 'GET',
    params: para
  })
}

/**
 * 七彩评价获取学校老师评价科目线性回归接口
 *
 * @export
 * @param {*} para
 * @returns
 */
export function schoolSubLinearRegress(para) {
  return request({
    url: '/qcpj/subject/schoolSubLinearRegress',
    method: 'GET',
    params: para
  })
}

export function getstudentSubLinearRegress(para) {
  return request({
    url: '/qcpj/subject/studentSubLinearRegress',
    method: 'GET',
    params: para
  })
}

export function getSchoolCoins(para) {
  return request({
    url: '/qcpj/subject/getSchoolCoins/' + para,
    method: 'GET'
  })
}
