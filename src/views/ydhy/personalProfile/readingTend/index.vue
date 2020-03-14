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
        >
          <el-option
            v-for="(stu,istu) in getClass"
            :key="istu"
            :value="stu.userId"
            :label="stu.name"
          />
        </el-select>
        <!-- 选择所想查看的科目 -->
        科目：
        <book-type-picker v-model="bookType" style="width:180px" class="item" @update="getReadHabitLinReg(stunum)" />
      </p>
    </div>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:1600px;height:600px;margin:0 auto;" />
  </div>
</template>
<script>
import store from '@/store/index.js'
import echarts from 'echarts'
import ecStat from 'echarts-stat'
import 'echarts/theme/macarons'
import { getSchools, getYDHYClassInfo, classUserInfo, getuserReadHabitLinReg } from '@/api/ydhy'
import BookTypePicker from '@/components/class/BookTypePicker'
export default {
  components: { BookTypePicker },
  data() {
    return {
      // 学校名称
      school: [],
      // 学校ID
      schoolId: '',
      // 此时的所有年级
      stugrade: '',
      // 此年级的所有班级
      stucla: '',
      // 该班级的学生人数
      stunum: '',
      // 当前选中的书类型
      bookType: '',
      // 该学生当前科目历史成绩
      historyScore: {},
      // 该学生该科目的平均成绩
      scrore: ''
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
    },
    // 参考群体画像对数据的处理方式
    wrappedData() {
      const save = []

      // 对单个用户的历史得分进行循环，包装成【周，分】的点
      const historys = JSON.parse(this.historyScore).map((item, index) => {
        return [index + 1, item]
      })
      save.push(...historys)
      return save
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
    getReadHabitLinReg(stunum) {
      getuserReadHabitLinReg({ userId: stunum, bookType: this.bookType })
        .then(res => {
          console.log(res.data.data)
          this.historyScore = res.data.data[0].historyScore
          this.scrore = res.data.data[0].nearSevInter
          console.log(this.historyScore)
          this.drawLinear()
        })
    },
    drawLinear() {
      const myRegression = ecStat.regression('linear', this.wrappedData)
      myRegression.points.sort(function(a, b) { return a[0] - b[0] })
      // console.log(this.wrappedData)
      const myChart = echarts.init(this.$refs.chart, 'macarons')
      myChart.clear()
      // 折线图属性设置
      myChart.setOption({
        title: {
          text: 'Linear Regression',
          subtext: 'By ecStat.regression',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 1.5,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          symbolSize: 10,
          name: 'scatter',
          type: 'scatter',
          emphasis: {
            label: {
              show: true,
              position: 'left',
              color: 'blue',
              fontSize: 16
            }
          },
          data: this.wrappedData
        },
        {
          name: 'line',
          type: 'line',
          showSymbol: false,
          data: myRegression.points,
          markPoint: {
            itemStyle: {
              color: 'transparent'
            },
            label: {
              show: true,
              position: 'left',
              formatter: myRegression.expression,
              color: '#333',
              fontSize: 14
            },
            data: [{
              coord: myRegression.points[myRegression.points.length - 1]
            }]
          }
        }]
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
