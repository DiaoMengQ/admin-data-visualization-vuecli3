<template>
  <div id="app">
    <div id="nav">
      <!-- 选择所想查看的学校 -->
      <p>选择学校：
        <el-select
          id="School"
          v-model="schoolId"
          name="school"
          placeholder="请选择学校"
          style="width:250px"
        >
          <el-option
            v-for="(item,schoolName) in school"
            :key="schoolName"
            :value="item.schoolId"
            :label="item.schoolName"
          />
        </el-select>

        <!-- 选择年级 -->
        年级：
        <el-select
          id="Grade"
          v-model="stugrade"
          name="grade"
          clearable
          placeholder="请选择年级"
          style="width:150px"
          @change="GradeChange(stugrade)"
        >
          <el-option
            v-for="(item,istugrade) in 6"
            :key="istugrade"
            :value="item"
            :label="item+'年级'"
          />
        </el-select>

        <!-- 学生班级 -->
        班级：
        <el-select
          id="Class"
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
        </el-select>

        <!-- 班级学生人数 -->
        班级学生：
        <el-select
          id="Student"
          v-model="stunum"
          name="student"
          clearable
          placeholder="请选择该班级的学生"
          style="width:180px"
          @change="getTaskStat(stunum)"
        >
          <el-option
            v-for="(stu,istu) in getClass"
            :key="istu"
            :value="stu.userId"
            :label="stu.name"
          />
        </el-select>
      </p>
    </div>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:1600px;height:600px;margin:0 auto;" />
  </div>
</template>
<script>
import store from '@/store/index.js'
import echarts from 'echarts'
// import ecStat from 'echarts-stat'
import 'echarts/theme/macarons'
import { getSchools, getYDHYClassInfo, classUserInfo, getuserTaskStat } from '@/api/ydhy'
export default {
  data() {
    return {
      // 获取学校名称
      school: [],
      // 学校ID
      schoolId: '',
      // 此时的所有年级
      stugrade: '',
      // 此年级的所有班级
      stucla: '',
      // 该班级的学生人数
      stunum: '',
      // 学生姓名
      stuName: '',
      // 已完成任务数
      finishNum: '',
      // 未完成任务数
      unfinishNum: '',
      // 逾期任务数
      overdueNum: '',
      // 任务完成率
      finishRate: '',
      // 任务逾期率
      overdueRate: ''
    }
  },
  computed: {
    // 将获取到该年级的所有班级放在computed中、做计算属性、当vuex的值发生改变会对应改变
    getGrade() {
      return store.state.Grade
    },
    // 将获取到该班级的所有学生
    getClass() {
      return store.state.Class
    }
  },
  created() {
    this.GetSchoolId()
  },
  methods: {
    // 获取学校ID
    GetSchoolId() {
      getSchools()
        .then(res => {
          console.log(res.data.data)
          this.school = res.data.data
        })
    },
    // 年级改变，同时获取该年级的所有班级
    GradeChange(item) {
      //   获取班级接口
      getYDHYClassInfo({ 'schoolId': this.schoolId, 'endGradeId': item, 'startGradeId': item })
        .then(res => {
          // 将获取到的年级存储到store中
          const grade = res.data.data
          store.commit('setGrade', grade)
          console.log(store.state.Grade)
        })
    },
    // 班级改变，获取该班级的Id,同时获取该班级的学生
    ClassChange(claId) {
      classUserInfo({ 'classId': claId })
        .then(res => {
          const stu = res.data.data
          store.commit('setClass', stu)
          // 传入sessionStorage中方便多选学生时，将学生名单传入多选中
          sessionStorage.setItem('stu', JSON.stringify(stu))
          console.log(store.state.Class)
        })
    },
    getTaskStat(stunum) {
      getuserTaskStat({ userId: stunum })
        .then(res => {
          console.log(res.data.data)
          this.stuName = res.data.data.name
          this.finishNum = res.data.data.finishNum
          this.finishRate = res.data.data.finishRate
          this.overdueNum = res.data.data.overdueNum
          this.overdueRate = res.data.data.overdueRate
          this.unfinishNum = res.data.data.unfinishNum
          this.drawMyChart()
        })
    },
    drawMyChart() {
      const myChart = echarts.init(this.$refs.chart, 'macarons')
      myChart.clear()
      // 图像属性设置
      myChart.setOption({
        title: [{
          text: this.stuName + '任务完成情况',
          subtext: '总未完成任务数 = 逾期任务数 + 未完成任务数',
          left: '25%',
          textAlign: 'center'
        }, {
          text: this.stuName + '任务完成率',
          left: '75%',
          textAlign: 'center'
        }],
        tooltip: { },
        grid: [{
          left: '5%',
          right: '50%',
          bottom: '3%',
          containLabel: true
        }],
        legend: {
          orient: 'vertical',
          left: 'right',
          top: '15%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['已完成任务数', '总未完成任务数', '逾期任务数', '未完成任务数'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '50%',
            data: [this.finishNum, this.unfinishNum, this.overdueNum, (this.unfinishNum - this.overdueNum)]
          },
          {
            name: '',
            type: 'pie',
            center: ['75%', '55%'],
            radius: '80%',
            data: [
              { value: this.finishRate, name: '已完成任务占比' },
              { value: this.overdueRate, name: '逾期任务占比' },
              { value: (1 - this.finishRate - this.overdueRate).toFixed(2), name: '未完成任务占比' }
            ]
          }
        ]
      })
    }
  }
}

</script>
<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;

}
</style>
