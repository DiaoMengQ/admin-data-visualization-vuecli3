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

    <div v-if="ifShowChart" id="chart-main" ref="chart" style="width:800px;height:600px;margin:0 auto;" />

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
      chartData: [],
      option: {
        title: {
          text: '群体线性回归分析',
          left: 'center'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
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
          min: 0,
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
              color: ' #0071e6',
              fontSize: 16
            }
          },
          //   data: chartData
          data: null
        }, {
          name: 'line',
          type: 'line',
          showSymbol: false,
          //   data: myRegression.points,
          data: null,
          markPoint: {
            itemStyle: {
              color: 'transparent'
            },
            label: {
              show: true,
              position: 'left',
              //   formatter: myRegression.expression,
              formatter: null,
              color: '#333',
              fontSize: 14
            },
            data: [{
            //   coord: myRegression.points[myRegression.points.length - 1]
              coord: null
            }]
          }
        }]
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
      coef: [-180, 180],
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
      const para = {
        schoolId: this.schoolId,
        gradeId: this.gradeId,
        startCoef: this.coef[0], // 斜率范围
        endCoef: this.coef[1], // 斜率范围
        modelScore: this.modelScore, // 线性回归模型的拟合度得分
        subject: this.subjectLabel, // 科目
        weekRange: this.weekRange // 可选周数: 1-9/9-18/1-18
      }
      console.log('线性回归请求参数', para)

      // 测试数据
      // const para = {
      //   schoolId: 1100002,
      //   gradeId: 4,
      //   startCoef: this.coef[0], // 斜率范围
      //   endCoef: this.coef[1], // 斜率范围
      //   modelScore: this.modelScore, // 线性回归模型的拟合度得分
      //   subject: '数学', // 科目
      //   weekRange: this.weekRange // 可选周数: 1-9/9-18/1-18
      // }

      if (this.classId === null || this.classId === '') {
        schoolSubLinearRegress(para).then((result) => {
          // console.log('线性回归返回数据', result.data.data)
          this.dataProcess(result.data.data)
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
        clusterChart.setOption(this.option, true)
      }
    },

    // chart配置项处理
    chartOptionAssignment() {
      // See https://github.com/ecomfe/echarts-stat
      const myRegression = ecStat.regression('linear', this.chartData)
      myRegression.points.sort(function(a, b) {
        return a[0] - b[0]
      })

      this.option.series[0].data = this.chartData

      this.option.series[1].data = myRegression.points
      this.option.series[1].markPoint.label.formatter = myRegression.expression
      this.option.series[1].markPoint.data[0].coord = myRegression.points[myRegression.points.length - 1]
    },

    // 数据处理
    dataProcess(data) {
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
    //   console.log(data)
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
    //   console.log(data)
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
