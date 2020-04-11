<!-- 系统访问数统计 -->
<template>
  <div id="app-container" style="margin:20px;">
    <el-row style="text-align:center;">
      <el-col :sm="24" :md="12" :lg="12" :xl="12">
        <el-radio-group v-model="selectedRangeType" style="margin:20px 20px 0 20px">
          <el-radio label="date">分时统计</el-radio>
          <el-radio label="daterange">日统计</el-radio>
          <el-radio label="monthrange">月统计</el-radio>
        </el-radio-group>
        <div>
          <!-- 参考文档：https://element.eleme.cn/#/zh-CN/component/date-picker -->
          <el-date-picker
            v-model="selectedDate"
            align="right"
            :type="selectedRangeType"
            placeholder="选择日期"
            :value-format="valueFormat"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            range-separator="-"
            :picker-options="pickerOptions"
            style="margin:1.3em 0"
          />
          <el-button-group>
            <el-button type="primary" :plain="QCPJplain" @click="getQCPJTimeVisitCount">七彩评价</el-button>
            <el-button type="primary" :plain="YDHYplain" @click="getYDHYTimeVisitCount">阅读海洋</el-button>
          </el-button-group>
        </div>
      </el-col>

      <el-col :sm="24" :md="12" :lg="12" :xl="12">
        <!-- <el-card> -->
        <el-row :gutter="20">
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-card shadow="never" header="累计访问">
              <!-- <div slot="header">
                  <span>累计访问</span>
                </div> -->
              <p class="count" style="color:#5A708B">{{ totalAccessCount }}</p>
            </el-card>
          </el-col>

          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-card shadow="never" header="所选时间范围访问">
              <p class="count" style="color:#79C5BC">{{ dateRangeAccessCount }}</p>
            </el-card>
          </el-col>
        </el-row>

        <!-- </el-card> -->
      </el-col>
    </el-row>

    <div id="chart-main" style="width:100%; height:650px; margin:3em 0" />
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import { getQCPJTimeVisitCount, getQCPJdayTimeVisitCount, getQCPJmonthTimeVisitCount, getQCPJallTimeVisitCount } from '@/api/system'
import { getYDHYTimeVisitCount, getYDHYdayTimeVisitCount, getYDHYmonthTimeVisitCount, getYDHYallTimeVisitCount } from '@/api/system'

export default {
  data() {
    return {
      selectedRangeType: 'date', // 所选的统计范围类型（时、日、月）

      startPlaceholder: '', // 日期选择器提示语
      endPlaceholder: '',

      valueFormat: 'yyyy-MM-dd', // 日期的格式化

      QCPJplain: true,
      YDHYplain: true,
      selectedDate: '', // 所选日期
      // 选择器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 3600 * 1000 * 24
        },
        shortcuts: [{
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },

      totalAccessCount: 0,
      dateRangeAccessCount: 0,

      chartOption: {
        title: {
          text: '时段访问统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['分时访问']
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '分时访问',
            type: 'line',
            smooth: false, // 设置曲线是否平滑
            stack: '总量',
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      }
    }
  },
  watch: {
    // 选择统计范围类型后设定日期选择器相关参数
    selectedRangeType(newVal) {
      // console.log(newVal)
      switch (newVal) {
        // 分时访问
        case 'date':
          this.valueFormat = 'yyyy-MM-dd'
          this.selectedDate = ''
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() > Date.now() - 3600 * 1000 * 24
            },
            shortcuts: [{
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }]
          }

          this.chartOption.legend.data[0] = '分时访问'
          this.chartOption.series[0].name = '分时访问'
          break

          // 每日访问
        case 'daterange' :
          this.valueFormat = 'yyyy-MM-dd'
          this.selectedDate = ''
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() > Date.now() - 3600 * 1000 * 24
            },
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                picker.$emit('pick', [start, end])
              }
            }]
          }
          this.startPlaceholder = '开始日期'
          this.endPlaceholder = '结束日期'

          this.chartOption.legend.data[0] = '当日访问'
          this.chartOption.series[0].name = '当日访问'
          break

          // 月访问
        case 'monthrange' :
          this.valueFormat = 'yyyy-MM'
          this.selectedDate = ''
          this.pickerOptions = {
            shortcuts: [{
              text: '今年至今',
              onClick(picker) {
                const end = new Date()
                const start = new Date(new Date().getFullYear(), 0)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近六个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setMonth(start.getMonth() - 6)
                picker.$emit('pick', [start, end])
              }
            }]
          }
          this.startPlaceholder = '开始月份'
          this.endPlaceholder = '结束月份'

          this.chartOption.legend.data[0] = '每月访问'
          this.chartOption.series[0].name = '每月访问'
          break

        default:
          break
      }
    }
  },
  methods: {
    getQCPJTimeVisitCount() {
      this.QCPJplain = false
      this.YDHYplain = true
      let param = null
      let allTimeVisitParam = null
      if (this.selectedDate && this.selectedDate !== null) {
        switch (this.selectedRangeType) {
          case 'date':
            param = { date: this.selectedDate }
            allTimeVisitParam = { sDate: this.selectedDate }
            getQCPJTimeVisitCount(param).then((result) => {
              this.dataHandle(result.data.data)
              this.drawChart()
            }).catch((err) => {
              console.log(err)
            })
            break

          case 'daterange':
            param = { sDate: this.selectedDate[0], eDate: this.selectedDate[1] }
            allTimeVisitParam = { sDate: this.selectedDate[0], eDate: this.selectedDate[1] }
            getQCPJdayTimeVisitCount(param).then((result) => {
              this.dataHandle(result.data.data)
              this.drawChart()
            }).catch((err) => {
              console.log(err)
            })
            break

          case 'monthrange':
            param = { sDate: this.selectedDate[0] + '-01', eDate: this.selectedDate[1] + '-01' }
            allTimeVisitParam = { sDate: this.selectedDate[0] + '-01', eDate: this.selectedDate[1] + '-01' }
            getQCPJmonthTimeVisitCount(param).then((result) => {
              this.dataHandle(result.data.data)
              this.drawChart()
            }).catch((err) => {
              console.log(err)
            })
            break

          default:
            break
        }

        // 给累计访问数和所选日期范围访问数赋值
        getQCPJallTimeVisitCount(allTimeVisitParam).then((result) => {
          const data = result.data.data
          this.totalAccessCount = data.totalnum
          this.dateRangeAccessCount = data.count
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message.error('请先选择日期范围')
      }
    },
    getYDHYTimeVisitCount() {
      this.QCPJplain = true
      this.YDHYplain = false
      let param = null
      let allTimeVisitParam = null
      if (this.selectedDate && this.selectedDate !== null) {
        switch (this.selectedRangeType) {
          case 'date':
            param = { date: this.selectedDate }
            allTimeVisitParam = { sDate: this.selectedDate }
            getYDHYTimeVisitCount(param).then((result) => {
              this.dataHandle(result.data.data)
              this.drawChart()
            }).catch((err) => {
              console.log(err)
            })
            break
          case 'daterange':
            param = { sDate: this.selectedDate[0], eDate: this.selectedDate[1] }
            allTimeVisitParam = { sDate: this.selectedDate[0], eDate: this.selectedDate[1] }
            getYDHYdayTimeVisitCount(param).then((result) => {
              this.dataHandle(result.data.data)
              this.drawChart()
            }).catch((err) => {
              console.log(err)
            })
            break
          case 'monthrange':
            param = { sDate: this.selectedDate[0] + '-01', eDate: this.selectedDate[1] + '-01' }
            allTimeVisitParam = { sDate: this.selectedDate[0] + '-01', eDate: this.selectedDate[1] + '-01' }
            getYDHYmonthTimeVisitCount(param).then((result) => {
              this.dataHandle(result.data.data)
              this.drawChart()
            }).catch((err) => {
              console.log(err)
            })
            break

          default:
            break
        }

        // 给累计访问数和所选日期范围访问数赋值
        getYDHYallTimeVisitCount(allTimeVisitParam).then((result) => {
          const data = result.data.data
          this.totalAccessCount = data.totalnum
          this.dateRangeAccessCount = data.count
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message.error('请先选择日期范围')
      }
    },
    drawChart() {
      echarts.init(document.getElementById('chart-main')).dispose()
      var myChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      myChart.setOption(this.chartOption)
    },
    dataHandle(data) {
      const xAxisData = []
      const seriesData = []
      for (let i = 0; i < data.length; i++) {
        xAxisData.push(data[i].time)
        seriesData.push(data[i].count)
      }
      this.chartOption.xAxis[0].data = xAxisData
      this.chartOption.series[0].data = seriesData

      switch (this.selectedRangeType) {
        case 'data':

          break
        case 'datarange':

          break
        case 'monthrange':

          break
        default:
          break
      }
      // this.chartOption.legend.data[0] = '每日访问'
      // this.chartOption.series[0].name = '当日访问'
      console.log(this.chartOption.legend.data[0], this.chartOption.series[0].name)
      // console.log(this.chartOption)
      return data
    }
  }
}
</script>

<style>
.count{
  font-size: 2em;
  font-weight: bold;
  margin: 0
}
.el-card__header{
  padding: 0.8em
}
</style>
