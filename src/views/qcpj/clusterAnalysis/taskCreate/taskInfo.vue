<template>
  <div id="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-tag style="margin:0 0 3em 0">当前所选学校: {{ schoolId }}  {{ schoolName }}</el-tag>
    </el-row>

    <el-form
      ref="taskInfo"
      v-loading="loading"
      :rules="taskInfoRules"
      label-position="left"
      :model="taskInfo"
      class="form-container"
    >
      <div class="createPost-main-container">
        <!-- row 内元素横向排列 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :xs="24" :sm="16">
            <!-- row 中的组件必须包在 el-col 中，否则会导致 input 和 select 无法获取焦点 -->
            <el-row>

              <!-- 年级 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <!-- 要想触发表单判断,此处 prop="B" 的 B 应与 v-model 中 A.B 的一致 -->
                <el-form-item prop="gradeItem" label-width="150px" label="年级:" class="postInfo-container-item">
                  <el-select
                    v-model="taskInfo.gradeItem"
                    value-key="gradeId"
                    name="grade"
                    clearable
                    placeholder="请选择年级"
                    style="width:200px"
                    @change="gradeChange(taskInfo.gradeItem)"
                  >
                    <el-option
                      v-for="grade in gradeList"
                      :key="grade.gradeId"
                      :label="grade.gradeName"
                      :value="grade"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 班级 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item prop="classItem" label-width="150px" label="班级:" class="postInfo-container-item">
                  <!-- 传一个对象需要添加 value-key 属性,其值为传出对象的其中一个属性 -->
                  <el-select
                    v-model="taskInfo.classItem"
                    value-key="classId"
                    name="class"
                    clearable
                    placeholder="请选择班级"
                    style="width:200px"
                    @change="classChange(taskInfo.classItem)"
                  >
                    <el-option
                      v-for="tClass in classList"
                      :key="tClass.classId"
                      :label="tClass.className"
                      :value="tClass"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 聚类分析科目选择 -->
              <el-col :xs="24" :lg="24" :xl="24">
                <el-form-item prop="checkedSubjects" label-width="150px" label="科目:" class="postInfo-container-item">
                  <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                  <div style="margin: 15px 0;" />
                  <el-checkbox-group v-model="taskInfo.checkedSubjects" @change="handleCheckedSubjectsChange(taskInfo.checkedSubjects)">
                    <!-- 此处的 :label 为传入 taskInfo.checkedSubjects 数组的数据 -->
                    <el-checkbox v-for="subj in subjects" :key="subj.subjectId" :label="subj">{{ subj.subjectLabel }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>

              <!-- 聚类样本数 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item prop="k" label-width="150px" label="聚类样本数(k):" class="postInfo-container-item">
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

              <!-- 周次 -->
              <el-col :xs="24" :lg="12" :xl="8">
                <el-form-item prop="week" label-width="150px" label="至第几周数据:" class="postInfo-container-item">
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

              <!-- 任务名称 -->
              <el-col :xs="24" :lg="24" :xl="24">
                <el-form-item prop="taskName" label-width="150px" label="任务名称:" class="postInfo-container-item">
                  <el-input v-model="taskInfo.taskName" type="text" placeholder="请输入任务名称" />
                </el-form-item>
              </el-col>

              <!-- 任务备注信息 -->
              <el-col :xs="24" :lg="24" :xl="24">
                <el-form-item label-width="150px" label="备注信息:" class="postInfo-container-item">
                  <el-input
                    v-model="taskInfo.remarks"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 8}"
                    placeholder="请输入备注信息"
                  />
                </el-form-item>
              </el-col>

            </el-row>
          </el-col>
        </el-row>

        <el-row class="admin-info-post-controler" type="flex" justify="end">
          <el-button type="primary" plain>清空</el-button>
          <el-button type="primary" @click="UpdateTaskInfo('taskInfo')">提交</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getClassinGrade, getSchoolSubjects, getSchoolInfo, createSubjectCluster } from '@/api/qcpj'
import { json2Obj } from '@/utils/index'
import { MessageBox, Message } from 'element-ui'
import { gradeList } from '@/utils/multiple'

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
      // 课程多选项
      checkAll: false, // 是否全选
      // checkedSubjects: [],
      subjects: subjectOptions, // 所有可选项
      // isIndeterminate 解释: https://element.eleme.cn/#/zh-CN/component/checkbox
      isIndeterminate: false, // 全选项的非全选标识

      loading: false, // 提交行为动态加载标识符

      schoolId: -1, // 学校ID
      schoolName: '', // 学校名称

      gradeId: '', // 所选年级代号
      gradeLabel: '',
      gradeList: [], // 年级可选项

      classList: [], // 班级可选项
      classLabel: '',

      weekList: WeekL, // 周列表

      kList: KL, // 可选聚类样本个数

      taskInfo: {
        k: '', // 聚类样本个数
        classId: '', // 所选班级ID
        week: '', // 至第几周数据
        taskName: '', // 聚类任务名称
        subjects: '', // 所选科目
        remarks: ',', // 备注
        checkedSubjects: []
      },
      // 表单验证规则: https://element.eleme.cn/#/zh-CN/component/form
      taskInfoRules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        gradeItem: [{ required: true, message: '请选择班级相关信息', trigger: 'change' }],
        classItem: [{ required: true, message: '请选择班级相关信息', trigger: 'change' }],
        k: [{ required: true, message: '请选择聚类样本数', trigger: 'change' }],
        checkedSubjects: [{ type: 'array', required: true, message: '请选择需要分析的课程', trigger: 'change' }],
        week: [{ required: true, message: '请选择需要分析的时间范围', trigger: 'change' }]

      }
    }
  },
  computed: {
    taskName: {
      // getter
      get: function() {
        return `${this.schoolName} ${this.gradeLabel}${this.classLabel}`
      }
    },
    remarks: {
      get: function() {
        const tempSubjLabel = []
        let tempRemark = ''

        if (this.taskInfo.checkedSubjects.length !== 0) {
          this.taskInfo.checkedSubjects.forEach(element => {
            tempSubjLabel.push(element.subjectLabel)
          })
          tempRemark = tempSubjLabel.toString()
          console.log(tempRemark)
        }

        if (this.taskInfo.k !== '' && !isNaN(this.taskInfo.k)) {
          tempRemark = `${tempRemark}\n聚类样本数: ${this.taskInfo.k}`
        }
        if (this.taskInfo.week !== '' && !isNaN(this.taskInfo.week)) {
          tempRemark = `${tempRemark}\n数据截止至第${this.taskInfo.week}周`
        }
        return tempRemark
      }
    }
  },
  watch: {
    taskName: {
      immediate: true,
      handler(val, old) {
        this.taskInfo.taskName = val
      }
    },
    remarks: {
      immediate: true,
      handler(val, old) {
        this.taskInfo.remarks = val
      }
    },
    // 监视年级选择行为
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
          this.classList = response.data.data
        })
      }
    }
  },
  created() {
    this.schoolId = this.$route.params && this.$route.params.schoolId
    this.gradeList = gradeList()
  },
  mounted() {
    // 请求学校信息(根据路径中的学校ID请求学校名称)
    getSchoolInfo({ schoolId: this.schoolId }).then(response => {
      this.schoolName = response.data.data[0].schoolName
    })
    // 请求七彩评价课程
    getSchoolSubjects(this.schoolId).then(response => {
      const subList = JSON.parse(response.data.data.subjects)
      subjectOptions = json2Obj(subList)
      this.subjects = subjectOptions
    })
  },
  methods: {
    // 年级选择变化
    gradeChange(gra) {
      this.gradeLabel = gra.gradeName
      this.gradeId = gra.gradeId
    },
    // 班级选择变化
    classChange(cla) {
      this.classLabel = cla.className
      this.taskInfo.classId = cla.classId
    },
    // 提交分析任务
    UpdateTaskInfo(taskInfo) {
      // 表单验证
      this.$refs[taskInfo].validate((valid) => {
        if (valid) {
          // this.loading = true

          // 将所选科目转换为 ID Array
          let checkedSubjectsId = []
          // 参数：value数组中的当前项, index当前项的索引, array原始数组；
          this.taskInfo.checkedSubjects.forEach((item) => {
            checkedSubjectsId.push(item['subjectId'])
          })
          checkedSubjectsId = checkedSubjectsId.join(',')
          this.taskInfo.subjects = '[' + checkedSubjectsId + ']'

          delete this.taskInfo['checkedSubjects']
          delete this.taskInfo['classItem']
          delete this.taskInfo['gradeItem']

          console.log('taskInfo', this.taskInfo)

          createSubjectCluster(this.taskInfo).then(response => {
            if (response.data.code === 200) {
              this.loading = false
              MessageBox.confirm('任务创建完成，请稍后于任务列表查看！', '已完成', {
                confirmButtonText: '完成',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                this.$router.push('/qcpj/clusterAnalysis/taskList')
              })
            }
          }).catch(error => {
            this.loading = false
            Message({
              message: '创建任务失败，请重试',
              type: 'error',
              duration: 5 * 1000
            })
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 全选判断
    handleCheckAllChange(val) {
      this.taskInfo.checkedSubjects = val ? subjectOptions : []
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
