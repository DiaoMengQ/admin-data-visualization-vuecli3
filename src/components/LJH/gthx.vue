<template>
  <div id="app">
    <div id="nav">
      <!-- 学生年级 -->
      <!-- GradeChange(stugrade) -->
      <p>年级：
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
          @change="StuChange(stunum)"
        >
          <el-option
            v-for="(stu,istu) in getClass"
            :key="istu"
            :value="stu.studentId"
            :label="stu.name"
          />
        </el-select></p>

      <!-- 周次
      <p>查询周次：
        <el-select
          id="Week"
          v-model="findweek"
          name="week"
          clearable
          placeholder="请选择想查询的周次"
        >
          <el-option
            v-for="(wk,thiswk) in getStu.length"
            :key="thiswk"
            :value="wk"
            :label="'第'+wk+'周'"
          />
        </el-select></p> -->

      <!-- 按钮部分 -->
      <el-button plain round type="primary" size="small" @click="barCharts(stunum,findweek)">各周成绩</el-button>
      <el-button plain round type="primary" size="small" @click="initCharts (stunum)">学期成绩</el-button>
      <el-button plain round type="primary" size="small" @click="pieCharts()">阅读兴趣分布</el-button>
      <el-button plain round type="primary" size="small" @click="pieCharts()">综合分析</el-button>

      <!-- <h2> {{ findweek }}周成绩</h2><hr> -->
    </div>
    <p v-show="ms">
      <el-button plain round type="primary" size="small" @click="MoreStudent()">选择多名学生</el-button>
    </p>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:800px;height:350px;margin:0 auto;" />
    <br>
    <!-- 只在显示各周成绩时显示出来 -->
    <p v-show="sw">
      选择周次：<el-slider v-model="findweek" show-input :max="maxweek" :min="1" style="width:50%;margin:0 auto" @change="barCharts(stunum,findweek)" />
    </p>
  </div>
</template>

<script>
import store from '@/store/index.js'
import echarts from 'echarts'
import 'echarts/theme/macarons'
import { getClassinGrade, getStuinClass, getStuSemester } from '@/api/qcpj'

export default {
  data() {
    return {
      // 此时的所有年级
      stugrade: '',
      // 此年级的所有班级
      stucla: '',
      // 该班级的学生人数
      stunum: '',
      // 查询周次
      findweek: '',
      // 使点击各周按钮时时间轴会显示出来
      sw: false,
      // 点击显示或隐藏多名学生按钮
      ms: false,
      // 获取所选中学生当前有多少周成绩
      maxweek: '7',
      // 获取所选中的学生名字
      nowStuName: '',
      // 获取当前周次
      nowWeek: ''
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
  watch: {
    // stugrade (val, oldval) {
    //   console.log(val, oldval)
    // }

  },
  mounted() {
    // this.initCharts()
  },
  methods: {
    MoreStudent() {
      window.open('http://localhost:5980/ydhy/moreStudent')
    },
    // flushCom: function() {
    //   // router是路由实例,例如:var router = new Router({})
    //   // router.go(n)是路由的一个方法，意思是在history记录中前进或者后退多少步，0就表示还是当前，类似window.history.go(n)
    //   this.$router.go(0)
    // },

    // 年级改变，同时获取该年级的所有班级
    GradeChange(item) {
      //   获取班级接口
      getClassinGrade({ 'schoolId': '4404001', 'endGradeId': item, 'startGradeId': item })
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
    // 所选学生改变，显示学生的各周次分数
    StuChange(Stu) {
      getStuSemester({ 'studentId': Stu })
        .then(res => {
        // console.log(res.data.data[0].subType)
          const sub = res.data.data
          store.commit('setStu', sub)
          console.log(store.state.Stu)
          this.maxweek = sub.length
          this.nowStuName = sub[0].name
          // console.log(sub[0].name)
        })
    },
    // 获取总周数
    // getWeek(){
    // },

    // 柱状图获取各周单科成绩
    barCharts(Stu, getweek) {
      // 未选择学生弹框提示先选择学生
      if (Stu.length <= 0) {
        this.$alert('请先选择学生', '错误！未选择学生', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      } else {
        // 使各周成绩中的选择周次轴显示
        this.sw = true
        this.ms = false
        const barChart = echarts.init(this.$refs.chart, 'macarons')
        // 清空echarts画布，避免图像重叠显示
        barChart.clear()
        barChart.setOption({
          title: { text: this.nowStuName + '——前' + this.findweek + '周——' + '成绩' },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['人文', '实践', '科学']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category'
          },
          series: []
        })
        getStuSemester({ 'studentId': Stu, 'week': getweek })
          .then(res => {
          // 定义学生人文成绩
            const objData = []
            // 定义实践成绩
            const objSj = []
            // 定义科学成绩
            const objKx = []
            // 定义用来存存储周次的数据，在后面setOption出将其传入x轴作为x轴的data
            const weekArr = []

            // 将获取到的学生成绩存储到sessionStorage中
            const sub = res.data.data
            sessionStorage.setItem('sub', JSON.stringify(sub))

            // 有几周成绩，同时将获取到的字符串转换为obj，没有成绩的赋值为0
            for (var i = 0; i < sub.length; i++) {
              console.log(sub[i].subType)
              /** 人文 */
              // 将获取到的字符串转为obj
              const obj = JSON.parse(sub[i].subType)
              if (obj['人文'] == null) {
                objData[i] = parseInt('0')
              } else {
              // 同时将获取到的每周人文转换为int，方便下方传入到图中data
                objData[i] = parseInt(obj['人文'])
              }
              console.log(obj['人文'])

              /** 实践 */
              if (obj['实践'] == null) {
                objSj[i] = parseInt('0')
              } else {
                // 同时将获取到的每周实践转换为int，方便下方传入到图中data
                objSj[i] = parseInt(obj['实践'])
              }

              /** 科学 */
              if (obj['科学'] == null) {
                objKx[i] = parseInt('0')
              } else {
                // 同时将获取到的每周科学转换为int，方便下方传入到图中data
                objKx[i] = parseInt(obj['科学'])
              }
              // 将周次传入到weekArr数组中，以便将周次实时同步
              weekArr[i] = ['第' + (i + 1) + '周']
            }

            // console.log(weekArr)
            // console.log(objData)

            // 此位置将获取到数据显示到图上
            barChart.setOption({
              series: [
                {
                  name: '人文',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'insideRight'
                    }
                  },
                  data: objData
                },
                {
                  name: '实践',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'insideRight'
                    }
                  },
                  data: objSj
                },
                {
                  name: '科学',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'insideRight'
                    }
                  },
                  data: objKx
                }
              ],
              yAxis: {
                data: weekArr
              }
            })
          })
          .catch(res => {
            console.log('Error：出错了！')
            console.log(res)
          })
      }
    },

    // 折线图显示获取到的数据
    initCharts(Stu) {
      if (Stu.length <= 0) {
        this.$alert('请先选择学生', '错误！未选择学生', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      } else {
      // 使各周成绩中的选择周次轴隐藏
        this.sw = false
        this.ms = true
        const myChart = echarts.init(this.$refs.chart, 'macarons')
        // let _this = this
        myChart.clear()
        // 折线图属性设置
        myChart.setOption({
          title: { text: this.nowStuName + '本学期成绩' },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false
          },
          yAxis: {
            type: 'value'
          },
          legend: {
            data: ['人文', '实践', '科学']
          },
          series: []
        })
        getStuSemester({ 'studentId': Stu })
          .then(res => {
          // 定义学生人文成绩
            const objData = []
            // 定义实践成绩
            const objSj = []
            // 定义科学成绩
            const objKx = []
            // 定义用来存存储周次的数据，在后面setOption出将其传入x轴作为x轴的data
            const weekArr = []

            // 将获取到的学生成绩存储到sessionStorage中
            const sub = res.data.data
            sessionStorage.setItem('sub', JSON.stringify(sub))

            // 有几周成绩，同时将获取到的字符串转换为obj，没有成绩的赋值为0
            for (var i = 0; i < sub.length; i++) {
              console.log(sub[i].subType)
              /** 人文 */
              // 将获取到的字符串转为obj
              const obj = JSON.parse(sub[i].subType)
              if (obj['人文'] == null) {
                objData[i] = parseInt('0')
              } else {
              // 同时将获取到的每周人文转换为int，方便下方传入到图中data
                objData[i] = parseInt(obj['人文'])
              }
              console.log(obj['人文'])

              /** 实践 */
              if (obj['实践'] == null) {
                objSj[i] = parseInt('0')
              } else {
                // 同时将获取到的每周实践转换为int，方便下方传入到图中data
                objSj[i] = parseInt(obj['实践'])
              }

              /** 科学 */
              if (obj['科学'] == null) {
                objKx[i] = parseInt('0')
              } else {
                // 同时将获取到的每周科学转换为int，方便下方传入到图中data
                objKx[i] = parseInt(obj['科学'])
              }
              // 将周次传入到weekArr数组中，以便将周次实时同步
              weekArr[i] = ['第' + (i + 1) + '周']
            }

            // console.log(weekArr)
            // console.log(objData)

            // 此位置将获取到数据显示到图上
            myChart.setOption({
              series: [
                {
                  name: '人文',
                  type: 'line',
                  areaStyle: {},
                  data: objData
                },
                {
                  name: '实践',
                  type: 'line',
                  areaStyle: {},
                  data: objSj
                },
                {
                  name: '科学',
                  type: 'line',
                  areaStyle: {},
                  data: objKx
                }
              ],
              xAxis: {
                data: weekArr
              }
            })
          })
          .catch(res => {
            console.log('Error：出错了！')
            console.log(res)
          })
      }
    },

    // 扇形图显示获取到的数据，暂无数据只能先用拟定的
    pieCharts() {
      // 使各周成绩中的选择周次轴隐藏
      this.sw = false
      this.ms = false
      const pieChart = echarts.init(this.$refs.chart, 'macarons')
      // 清空echarts画布，避免图像重叠显示
      pieChart.clear()
      pieChart.setOption({
        title: {
          text: this.nowStuName + '阅读兴趣',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: '',
          left: 'right',
          data: ['科学', '历史', '漫画', '名人', '名著', '父母', '神话', '诗歌', '数学', '教师', '童话', '小说']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '70%',
            center: ['50%', '60%'],
            data: [
              { value: 15, name: '科学' },
              { value: 2, name: '历史' },
              // { value: 3, name: '漫画' },
              { value: 4, name: '名人' },
              { value: 5, name: '名著' },
              // { value: 6, name: '父母' },
              // { value: 7, name: '神话' },
              // { value: 8, name: '诗歌' },
              { value: 9, name: '数学' },
              { value: 10, name: '教师' },
              // { value: 11, name: '童话' },
              { value: 12, name: '小说' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;

}
</style>
