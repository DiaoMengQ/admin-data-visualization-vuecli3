<template>
  <div id="app-content">
    <el-form>
      <el-row>
        <auth-judge @selected-area-change="getSelectedArea" />
        <school-picker :selected-area="areaCode" selected-platform="QCPJ" @selected-sch-change="getSelectedSch" />
        <class-picker :school-id="schoolId" @selected-class-change="getSelectedClass" />

        <!-- 课程 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="课程:" class="postInfo-container-item">
            <el-select v-model="subjectLabel" placeholder="请选择">
              <el-option
                v-for="(subj,index) in subjectList"
                :key="index"
                :label="subj['subjectLabel']"
                :value="subj['subjectLabel']"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 学期范围 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="学期范围:" class="postInfo-container-item">
            <el-select v-model="weekRange" placeholder="请选择">
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

      <!-- 斜率范围 -->
      <el-row>
        <el-col :sm="20" :md="20" :lg="12" :xl="8">
          <el-form-item label-width="100px" label="斜率范围:" class="postInfo-container-item">
            <el-slider
              v-model="coef"
              range
              show-stops
              :min="coefRange[0]"
              :max="coefRange[1]"
              :step="coefStep"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 数据相关度 -->
      <el-row>
        <el-col :sm="20" :md="20" :lg="12" :xl="8">
          <el-form-item label-width="100px" label="数据相关度:" class="postInfo-container-item">
            <el-slider
              v-model="modelScore"
              show-stops
              :max="1"
              :step="modelScoreStep"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="admin-info-post-controler" type="flex" justify="end">
        <el-button type="primary" @click="getQcpjEvaStat">查询</el-button>
      </el-row>
    </el-form>

    <div v-if="ifShowChart" id="chart-main" ref="chart" :style="[{ 'height': chartHeight + 'px' },{'width':'100%'}]" />
  </div>
</template>

<script>
import AuthJudge from './components/AuthorityJudgement'
import ClassPicker from './components/ClassPicker'
import SchoolPicker from './components/SchoolPicker'
import { schoolSubLinearRegress, classSubLinearRegress, getSchoolSubjects } from '@/api/qcpj'

import echarts from 'echarts'
import 'echarts/theme/macarons'
// 引入提示框和标题组件
require('echarts/lib/component/title')
import ecStat from 'echarts-stat'

export default {
  components: { AuthJudge, ClassPicker, SchoolPicker },
  data() {
    return {
      chartHeight: 600,

      chartData: [
        [
          [10.0, 8.04],
          [8.0, 6.95],
          [13.0, 7.58],
          [9.0, 8.81],
          [11.0, 8.33],
          [14.0, 9.96],
          [6.0, 7.24],
          [4.0, 4.26],
          [12.0, 10.84],
          [7.0, 4.82],
          [7.0, 2]
        ],
        [
          [10.0, 9.14],
          [8.0, 8.14],
          [13.0, 8.74],
          [9.0, 8.77],
          [11.0, 9.26],
          [14.0, 8.10],
          [6.0, 6.13],
          [4.0, 3.10],
          [12.0, 9.13],
          [7.0, 7.26],
          [5.0, 4.74]
        ],
        [
          [10.0, 7.46],
          [8.0, 6.77],
          [13.0, 12.74],
          [9.0, 7.11],
          [11.0, 7.81],
          [14.0, 8.84],
          [6.0, 6.08],
          [4.0, 5.39],
          [12.0, 8.15],
          [7.0, 6.42],
          [5.0, 5.73]
        ],
        [
          [8.0, 6.58],
          [8.0, 5.76],
          [8.0, 7.71],
          [8.0, 8.84],
          [8.0, 8.47],
          [8.0, 7.04],
          [8.0, 5.25],
          [19.0, 12.50],
          [8.0, 5.56],
          [8.0, 7.91],
          [8.0, 6.89]
        ]
      ],

      option: {
        title: {
          text: 'Anscombe\'s quartet',
          left: 'center',
          top: 0
        },
        grid: [
          { x: '7%', y: '7%', width: '38%', height: '38%' }
        ],
        tooltip: {
          formatter: 'Group {a}: ({c})'
        },
        xAxis: [
          { gridIndex: 0, name: '1', nameGap: 25, nameLocation: 'middle' }
        ],
        yAxis: [
          { gridIndex: 0 }
        ],
        series: [
          {
            name: 'I',
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
            // data: this.chartData[0],
            data: null,
            // markLine: markLineOpt
            markLine: null
          }
        ]
      },

      areaCode: null,
      schoolId: null,
      classId: '',
      gradeId: '',

      subjectLabel: null,
      subjectList: [],

      ifShowChart: true, // 是否显示图表

      modelScore: 0,
      modelScoreStep: 0.1,
      coef: [0, 180],
      coefRange: [-180, 180],
      coefStep: 10,

      weekRange: '1-18',
      weekList: [
        { weekId: '1-9', weekLabel: '上半学期' },
        { weekId: '10-18', weekLabel: '下半学期' },
        { weekId: '1-18', weekLabel: '全学年' }
      ]
    }
  },
  methods: {
    // 获取QCPJ学校科目线性回归相关数据
    getQcpjEvaStat() {
    //   const para = {
    //     schoolId: this.schoolId,
    //     gradeId: this.gradeId,
    //     startCoef: this.coef[0], // 斜率范围
    //     endCoef: this.coef[1], // 斜率范围
    //     modelScore: this.modelScore, // 线性回归模型的拟合度得分
    //     subject: this.subjectLabel, // 科目
    //     weekRange: this.weekRange // 可选周数: 1-9/9-18/1-18
    //   }

      // 测试数据
      const para = {
        schoolId: 1100002,
        gradeId: 4,
        startCoef: this.coef[0], // 斜率范围
        endCoef: this.coef[1], // 斜率范围
        modelScore: this.modelScore, // 线性回归模型的拟合度得分
        subject: '数学', // 科目
        weekRange: this.weekRange // 可选周数: 1-9/9-18/1-18
      }

      if (this.classId === null || this.classId === '') {
        schoolSubLinearRegress(para).then((result) => {
        //   console.log('线性回归返回数据', result.data.data)
        //   this.dataProcess(result.data.data)
          this.drawChart()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        para.classId = this.classId
        classSubLinearRegress(para).then((result) => {
          // console.log('线性回归返回数据', result.data.data)
          this.dataProcess(result.data.data)
          this.drawChart()
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    // 绘制图形
    drawChart() {
      this.ifShowChart = true
      // 基于准备好的dom，初始化echarts实例
      var clusterChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      this.chartOptionAssignment()

      // 绘制图表
      if (this.option && typeof this.option === 'object') {
        console.log(this.option)
        clusterChart.setOption(this.option, true)
      }
    },

    // chart配置项处理
    chartOptionAssignment() {
      // See https://github.com/ecomfe/echarts-stat
      const myRegression = ecStat.regression('linear', this.chartData[0])
      myRegression.points.sort(function(a, b) {
        return a[0] - b[0]
      })

      const markLineOpt = {
        animation: true,
        label: {
          formatter: myRegression.expression,
          align: 'right'
        },
        lineStyle: {
          type: 'solid'
        },
        tooltip: {
          formatter: myRegression.expression
        },
        data: [
          [{
            coord: myRegression.points[0],
            symbol: 'none'
          },
          {
            coord: myRegression.points[myRegression.points.length - 1],
            symbol: 'none'
          }]
        ]
      }

      this.option.series[0].data = this.chartData[0]

      this.option.series[0].markLine = markLineOpt
    },

    // 数据处理
    dataProcess(data) {
      console.log('处理前数据', data)
      const scoreList = []
      for (let i = 0; i < data.length; i++) {
        const score = JSON.parse(data[i].score)
        for (let j = 0; j < score.length; j++) {
          scoreList.push([score[j].week, score[j].score])
        }
      }
      // console.log('处理后', scoreList)
      this.chartData = scoreList
    },

    // 获取子组件传入的学校
    getSelectedSch(data) {
      this.schoolId = data
      this.gradeId = null
      this.classId = null
      const subjectList = []
      getSchoolSubjects(this.schoolId).then((result) => {
        const subjects = result.data.data.subjects
        JSON.parse(subjects, function(k, v) {
          if (k) { subjectList.push({ subjectLabel: k }) }
        })
        // console.log(subjectList)
        this.subjectList = subjectList
      }).catch((err) => {
        console.log(err)
      })
    },

    // 获取子组件传入的年级和班级
    getSelectedClass(data) {
      this.gradeId = data.gradeId
      this.classId = data.classId
    },

    // 获取子组件传入的所选区域
    getSelectedArea(data) {
      this.areaCode = data
    }

  }
}
</script>

<style>
#app-content{margin: 1.8em}

</style>
