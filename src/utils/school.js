/**
 * 临时信息存取(cookie)
 * @author 刁梦齐 <dmq1212@qq.com>
 * @version 0.0.1
 */

const SchoolId = 'school-id'
const SchoolName = 'school-name'

// setter: schoolid & schoolname
export function setSchoolVal(schoolInfo) {
  localStorage.setItem(SchoolId, schoolInfo['schoolId'])
  localStorage.setItem(SchoolName, schoolInfo['schoolName'])
}

// getter: schoolid
export function getSchoolId() {
  return localStorage.getItem(SchoolId)
}
// getter: schoolname
export function getSchoolName() {
  return localStorage.getItem(SchoolName)
}

// remove: schoolid & schoolname
export function removeSchoolVal(schoolInfo) {
  localStorage.setItem(SchoolId, '')
  localStorage.setItem(SchoolName, '')
}
