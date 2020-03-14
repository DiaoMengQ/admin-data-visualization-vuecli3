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
          @change="GetuserReadHabit(stunum)"
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
import { getSchools, getYDHYClassInfo, classUserInfo, getuserReadHabit } from '@/api/ydhy'
export default {
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
      //   科目名称
      bookType: [],
      //   科目成绩
      score: [],
      //   历史成绩
      historyscore: [],
      //   各科成绩
      bookScore: []
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
    GetuserReadHabit(stunum) {
      getuserReadHabit({ userId: stunum })
        .then(res => {
        //   console.log(res.data.data)
          const data = res.data.data
          console.log(data)
          for (let i = 0; i < data.length; i++) {
            this.bookType[i] = data[i].bookType
            this.score[i] = data[i].score
            this.historyscore[i] = data[i].historyScore.replace([], '')
          }
          console.log(this.historyscore[0])
          console.log(this.bookType)
          var a = []
          var b = []
          for (var n = 1; n <= this.historyscore[0].split(',').length; n++) {
            b[n] = n
          }
          a[0] = '[' + '"product"' + b + ']'
          for (var j = 1; j <= this.historyscore.length; j++) {
            a[j ] = '[' + '"' + this.bookType[j - 1] + '",' + this.historyscore[j - 1].replace(/\[|]/g, '') + ']'
          }

          console.log(a)
          this.drawMyChart(a)
        })
    },
    drawMyChart(a) {
      const myChart = echarts.init(this.$refs.chart, 'macarons')
      myChart.clear()
      myChart.setOption({
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [a]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '1',
              tooltip: '1'
            }
          }
        ]
      })
      myChart.on('updateAxisPointer', function(event) {
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
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
