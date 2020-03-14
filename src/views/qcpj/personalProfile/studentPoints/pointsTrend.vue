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

        <!-- 学生年级 -->
        <!-- GradeChange(stugrade) -->
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
          @change="getSubLinearRegress(stunum)"
        >
          <el-option
            v-for="(stu,istu) in getClass"
            :key="istu"
            :value="stu.studentId"
            :label="stu.name"
          />
        </el-select>
        <br>
      </p>
      <p>
        <!-- 斜率范围 -->
        <el-row>
          <el-col :lg="12" :xl="8">
            <el-form>
              <el-form-item label-width="100px" label="系数范围：" class="posiInfo-container-item" @change="getSubLinearRegress(stunum)">
                <el-slider v-model="coef" range show-stops :min="coefRange[0]" :max="coefRange[1]" :step="coefStep" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- 数据相光度 -->
        <el-row>
          <el-col :lg="12" :xl="8">
            <el-form>
              <el-form-item label="数据相关度" label-width="100px" class="postInfo-container-item" @change="getSubLinearRegress(stunum)">
                <el-slider v-model="modelScore" show-stops :max="1" :step="modelScoreStep" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- 学期范围 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="学期范围：" class="postInfo-container-item" @change="getSubLinearRegress(stunum)">
              <el-select v-model="weekRange" placeholder="请选择">
                <el-option v-for="week in weekList" :key="week.weekId" :label="week.weekLabel" :value="week.weekId" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="科目选择：" class="postInfo-container-item">
              <el-select v-model="book " placeholder="请选择">
                <el-option v-for="bk in bookType" :key="bk.bookTypeId" :label="bk.bookTypeLabel" :value="bk.bookTypeId" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
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
import { getSchoolInfo, getClassinGrade, getStuinClass, getstudentSubLinearRegress } from '@/api/qcpj'
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
      // 查询周次
      findweek: '',
      // 获取所选中学生当前有多少周成绩
      maxweek: '7',
      // 获取所选中的学生名字
      nowStuName: '',

      weekRange: '',
      book: '',
      modelScore: 0.7457315232377556,
      modelScoreStep: 0.1,
      coef: [-180, 180],
      coefRange: [-180, 180],
      coefStep: 10,
      weekList1: [
        { weekId: '1-9', weekLabel: '上半学期' },
        { weekId: '9-18', weekLabel: '下半学期' },
        { weekId: '1-18', weekLabel: '全学年' }
      ],
      weekList: '1-18',
      bookType: '数学',
      bookType1: [
        { bookTypeId: '书法', bookTypeLabel: '书法' },
        { bookTypeId: '体育', bookTypeLabel: '体育' },
        { bookTypeId: '体育活动', bookTypeLabel: '体育活动' },
        { bookTypeId: '信息技术', bookTypeLabel: '信息技术' },
        { bookTypeId: '品德与操行', bookTypeLabel: '品德与操行' },
        { bookTypeId: '品德与社会', bookTypeLabel: '品德与社会' },
        { bookTypeId: '幸福生活劳动', bookTypeLabel: '幸福生活劳动' },
        { bookTypeId: '德育', bookTypeLabel: '德育' },
        { bookTypeId: '心理健康', bookTypeLabel: '心理健康' },
        { bookTypeId: '数学', bookTypeLabel: '数学' },
        { bookTypeId: '科学', bookTypeLabel: '科学' },
        { bookTypeId: '综合实践', bookTypeLabel: '综合实践' },
        { bookTypeId: '美术', bookTypeLabel: '美术' },
        { bookTypeId: '英语', bookTypeLabel: '英语' },
        { bookTypeId: '语文', bookTypeLabel: '语文' },
        { bookTypeId: '足球', bookTypeLabel: '足球' },
        { bookTypeId: '道德与法治', bookTypeLabel: '道德与法治' },
        { bookTypeId: '阅读', bookTypeLabel: '阅读' },
        { bookTypeId: '队会', bookTypeLabel: '队会' },
        { bookTypeId: '音乐', bookTypeLabel: '音乐' }
      ]
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
    // 将获取到的学生ID,获取其每周分数
    getStu() {
      return store.state.Stu
    }
  },
  created() {
    // 获取学校ID
    getSchoolInfo()
      .then(res => {
        console.log(res.data.data)
        this.school = res.data.data
      })
  },
  methods: {
    // 年级改变，同时获取该年级的所有班级
    GradeChange(item) {
      //   获取班级接口
      getClassinGrade({ 'schoolId': this.schoolId, 'endGradeId': item, 'startGradeId': item })
        .then(res => {
          // 将获取到的年级存储到store中
          const grade = res.data.data
          store.commit('setGrade', grade)
          console.log(store.state.Grade)

          // console.log(store.state.Grade[0].className)
        })
    },
    // 班级改变，获取该班级的Id,同时获取该班级的学生
    ClassChange(claId) {
      getStuinClass({ 'classId': claId })
        .then(res => {
          const stu = res.data.data
          store.commit('setClass', stu)
          // 传入sessionStorage中方便多选学生时，将学生名单传入多选中
          sessionStorage.setItem('stu', JSON.stringify(stu))
          console.log(store.state.Class)
        })
    },
    getSubLinearRegress(stunum) {
      getstudentSubLinearRegress({
        studentId: stunum,
        endCoef: '180',
        modelScore: this.modelScore,
        startCoef: '-180',
        subject: this.bookType,
        weekRange: this.weekList

      })
        .then(res => {
          // console.log(res.data.data)
          const Score = res.data.data[0].score
          // console.log(Score)
          // console.log(Score.split('}'))
          // console.log(Score.length)
          var a = []
          for (var i = 0; i < (Score.split('}').length - 1); i++) {
            // 对获取到的结果进行正则筛选
            a = Score.replace(/[^\d,]/g, '')
          }
          console.log(a)
          var b = a.split(',')
          var c = []
          var d = []
          for (var j = 0, k = 0; k < (b.length / 2) || j < b.length; j = j + 2, k++) {
            c[k] = [parseInt(b[j + 1]), parseInt(b[j])]
            d[k] = c[k]
          }
          // console.log(a)
          // console.log(b)
          console.log(c)
          // var d = c.split(',')
          console.log(d)
          this.drawLinear(d)
        })
    },
    drawLinear(c) {
      const myRegression = ecStat.regression('linear', c)
      myRegression.points.sort(function(a, b) { return a[0] - b[0] })
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
          symbolSize: 20,
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
          data: c
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
