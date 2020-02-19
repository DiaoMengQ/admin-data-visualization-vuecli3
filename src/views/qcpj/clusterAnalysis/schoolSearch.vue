<template>
  <div id="app-container">
    <el-tag style="margin:0 0 3em 0">当前所选学校: {{ schoolId }}  {{ schoolName }}</el-tag>

    <el-form
      ref="taskInfo"
      label-position="left"
      :model="taskInfo"
      class="form-container"
    >
      <div class="createPost-main-container">
        <!-- row 内元素横向排列 -->
        <el-row>
          <el-col :xs="24" :sm="16">
            <!-- row 中的组件必须包在 el-col 中，否则会导致 input 和 select 无法获取焦点 -->
            <el-row>
              <!-- 聚类分析科目选择 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="150px" label="科目:" class="postInfo-container-item">
                  <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                  <div style="margin: 15px 0;" />
                  <el-checkbox-group v-model="checkedSubjects" @change="handleCheckedSubjectsChange">
                    <el-checkbox v-for="subj in subjects" :key="subj.subjectId" :label="subj.subjectLabel">{{ subj.subjectLabel }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>

              <!-- 任务名称 -->
              <el-col :xs="24" :lg="24" :xl="24">
                <el-form-item label-width="150px" label="任务名称:" class="postInfo-container-item">
                  <el-input v-model="taskInfo.taskName" type="text" placeholder="请输入任务名称" />
                </el-form-item>
              </el-col>

              <!-- 学生年级 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="150px" label="年级:" class="postInfo-container-item">
                  <el-select
                    v-model="gradeId"
                    name="grade"
                    clearable
                    placeholder="请选择年级"
                    style="width:150px"
                  >
                    <el-option
                      v-for="grade in gradeList"
                      :key="grade.gradeId"
                      :value="grade.gradeId"
                      :label="grade.gradeName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 学生班级 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="150px" label="班级:" class="postInfo-container-item">
                  <el-select
                    v-model="taskInfo.classId"
                    name="class"
                    clearable
                    placeholder="请选择班级"
                    style="width:150px"
                  >
                    <el-option
                      v-for="tClass in classList"
                      :key="tClass.classId"
                      :value="tClass.classId"
                      :label="tClass.className"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="150px" label="聚类样本数(k):" class="postInfo-container-item">
                  <el-select v-model="taskInfo.k" placeholder="请选择聚类样本数">
                    <el-option
                      v-for="k in kList"
                      :key="k.kVal"
                      :label="k.kVal"
                      :value="k.kVal"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item label-width="150px" label="至第几周数据:" class="postInfo-container-item">
                  <!-- el-option 中的 value 会与 el-select 中的 v-model 进行绑定 -->
                  <el-select v-model="taskInfo.week" placeholder="请选择周次">
                    <el-option
                      v-for="week in weekList"
                      :key="week.weekId"
                      :label="week.weekLabel"
                      :value="week.weekId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <!-- <el-row class="admin-info-post-controler" type="flex" justify="end">
          <el-button v-loading="loading" type="primary" @click="UpdateTaskInfo">提交</el-button>
          <el-button v-loading="loading" type="primary" plain>取消</el-button>
        </el-row> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
import { getClassinGrade, getSchoolSubjects } from '@/api/qcpj'
import { getSchoolId, getSchoolName, removeSchoolVal } from '@/utils/school'
import { json2Obj } from '@/utils/index'

const GradeL = [
  { gradeId: 1, gradeName: '一年级' },
  { gradeId: 2, gradeName: '二年级' },
  { gradeId: 3, gradeName: '三年级' },
  { gradeId: 4, gradeName: '四年级' },
  { gradeId: 5, gradeName: '五年级' },
  { gradeId: 6, gradeName: '六年级' }
]
const WeekL = [
  { weekId: 1, weekLabel: '至第 1 周' },
  { weekId: 2, weekLabel: '至第 2 周' },
  { weekId: 3, weekLabel: '至第 3 周' },
  { weekId: 4, weekLabel: '至第 4 周' },
  { weekId: 5, weekLabel: '至第 5 周' },
  { weekId: 6, weekLabel: '至第 6 周' },
  { weekId: 7, weekLabel: '至第 7 周' },
  { weekId: 8, weekLabel: '至第 8 周' },
  { weekId: 9, weekLabel: '至第 9 周' },
  { weekId: 10, weekLabel: '至第 10 周' },
  { weekId: 11, weekLabel: '至第 11 周' },
  { weekId: 12, weekLabel: '至第 12 周' },
  { weekId: 13, weekLabel: '至第 13 周' },
  { weekId: 14, weekLabel: '至第 14 周' },
  { weekId: 15, weekLabel: '至第 15 周' },
  { weekId: 16, weekLabel: '至第 16 周' },
  { weekId: 17, weekLabel: '至第 17 周' },
  { weekId: 18, weekLabel: '至第 18 周' }
]
const KL = [
  { kVal: 1 },
  { kVal: 2 },
  { kVal: 3 },
  { kVal: 4 },
  { kVal: 5 }
]
let subjectOptions = []

export default {
  data() {
    return {
      // 多选项
      checkAll: false, // 是否全选
      checkedSubjects: [], // 已选选项
      subjects: subjectOptions, // 所有可选项
      // isIndeterminate 解释: https://element.eleme.cn/#/zh-CN/component/checkbox
      isIndeterminate: false, // 全选项的非全选标识

      schoolId: -1, // 学校ID
      schoolName: '', // 学校名称
      gradeId: '', // 所选年级代号
      gradeList: GradeL, // 年级可选项
      classList: [], // 班级可选项
      weekList: WeekL,
      kList: KL,
      taskInfo: {
        k: '',
        classId: '',
        week: '',
        taskName: '',
        subject: []
      }
    }
  },
  computed: {
    // 将获取到该年级的所有班级放在computed中、做计算属性、当vuex的值发生改变会对应改变

  },
  watch: {
    gradeId: {
      immediate: true,
      handler(val, old) {
        // console.log('新选中值: ', val, '旧值: ', old)
        const classReqPara = {
          startGradeId: this.gradeId,
          endGradeId: this.gradeId,
          schoolId: this.schoolId
        }
        getClassinGrade(classReqPara).then(response => {
          console.log(response.data.data)
          this.classList = response.data.data
        })
      }
    }
  },
  created() {
    this.schoolId = this.$route.params && this.$route.params.schoolId
    if (this.schoolId === getSchoolId()) {
      if (getSchoolName() && getSchoolName() !== '') {
        this.schoolName = getSchoolName()
      } else {
        console.log('储存所选学校信息出错')
        removeSchoolVal()
      }
    }
  },
  mounted() {
    // 请求七彩评价课程
    getSchoolSubjects(this.schoolId).then(response => {
      const subList = JSON.parse(response.data.data.subjects)
      subjectOptions = json2Obj(subList)
      this.subjects = subjectOptions
      console.log(this.subjects)
    })
  },
  destroyed() {
    // console.log('已销毁学校信息储存')
    // removeSchoolVal()
  },
  methods: {
    // 提交分析任务
    UpdateTaskInfo() {
    },

    // 全选判断
    // TODO: 全选判断未完成
    handleCheckAllChange(val) {
      this.checkedSubjects = val ? subjectOptions : []
      this.isIndeterminate = false
    },
    // 非全选与空选
    handleCheckedSubjectsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.subjects.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.subjects.length
    }
  }
}
</script>

<style lang="scss" scoped>
#app-container {
  padding: 40px 45px 20px 50px;
}

</style>
