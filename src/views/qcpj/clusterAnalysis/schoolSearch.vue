<template>
  <div id="app">
    <el-tag>当前所选学校: {{ schoolId }}  {{ schoolName }}</el-tag>

    <p>
      <!-- 学生年级 -->
      年级：
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

      <!-- 学生班级 -->
      班级：
      <!-- <el-select
        v-model="stucla"
        name="class"
        clearable
        placeholder="请选择班级"
        style="width:150px"
        @change="ClassChange (stucla)"
      >
        <el-option
          v-for="(claId,istucla) in getGrade"
          :key="istucla"
          :value="claId.classId"
          :label="claId.className"
        />
      </el-select> -->

      <!-- 班级学生人数 -->
      班级学生：
      <!-- <el-select
        id="Student"
        v-model="stunum"
        name="student"
        clearable
        placeholder="请选择该班级的学生"
        style="width:180px"
        @change="StuChange(stunum)"
      >
        <el-option
          v-for="(stu,istu) in getClass"
          :key="istu"
          :value="stu.studentId"
          :label="stu.name"
        />
      </el-select> -->
    </p>

  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
import { getClassinGrade } from '@/api/qcpj'
import { getSchoolId, getSchoolName, removeSchoolVal } from '@/utils/school'

export default {
  data() {
    return {
      schoolId: -1,
      schoolName: '',
      gradeId: 1,
      gradeList: [
        { gradeId: 1, gradeName: '一年级' },
        { gradeId: 2, gradeName: '二年级' },
        { gradeId: 3, gradeName: '三年级' },
        { gradeId: 4, gradeName: '四年级' },
        { gradeId: 5, gradeName: '五年级' },
        { gradeId: 6, gradeName: '六年级' }
      ],
      classId: '',
      classList: []
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
  },
  destroyed() {
    console.log('已销毁学校信息储存')
    removeSchoolVal()
  },
  methods: {
    // 获取班级信息
    // async getClassInfo(chosenSch) {
    //   const reqClassData = {
    //     startGradeId: this.startGrade,
    //     endGradeId: this.endGrade,
    //     schoolId: chosenSch['schoolId']
    //   }
    //   var classList = await getClassinGrade(reqClassData)
    //   console.log(classList)

    //   this.classList = classList
    // }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 30px;
}
</style>
