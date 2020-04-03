<!-- 访问响应码统计 -->
<template>
  <div id="app-container">
    <div style="margin:20px;text-align:center;">
      <el-date-picker
        v-model="selectedDate"
        style="min-width:400px;margin:10px"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        @change="selectedDateChange"
      />

      <el-button-group>
        <el-button type="primary" :plain="QCPJplain" @click="getQCPJrespCode">七彩评价</el-button>
        <el-button type="primary" :plain="YDHYplain" @click="getYDHYrespCode">阅读海洋</el-button>
      </el-button-group>
    </div>
    <div id="chart-main" style="width:100%; height:650px" />
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import { QCPJresponseCodeCount, YDHYresponseCodeCount } from '@/api/system'
import { getMiddleDateList } from '@/utils/multiple'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      pickerOptions: {
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
      },
      selectedDate: '',
      dateList: [],

      //   响应状态码
      responseCodeList: {
        '200': 1,
        '206': 2,
        '302': 3,
        '304': 4,
        '400': 5,
        '401': 6,
        '403': 7,
        '404': 8,
        '405': 9,
        '500': 10,
        '501': 11
      },

      QCPJplain: true,
      YDHYplain: true,

      // example: https://www.echartsjs.com/examples/zh/editor.html?c=dataset-link
      chartOption: {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '31%'],
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'date',
              value: '2012',
              tooltip: '2012'
            }
          },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' }
        ]
      }
    }
  },
  created() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    selectedDateChange() {
      this.initData()
      if (this.selectedDate && this.selectedDate !== null) {
        this.dateList = getMiddleDateList(this.selectedDate[0], this.selectedDate[1])

        this.chartOption.series[0].label.formatter = '{b}: {@' + this.dateList[0] + '} ({d}%)'
        this.chartOption.series[0].encode.value = this.dateList[0]
        this.chartOption.series[0].encode.tooltip = this.dateList[0]

        for (let i = 0; i < this.dateList.length; i++) {
          this.chartOption.dataset.source[0].push(this.dateList[i])
        }
      }
    },
    // 获取阅读海洋响应码统计数值
    getYDHYrespCode() {
      this.QCPJplain = true
      this.YDHYplain = false

      const codeList = Object.keys(this.responseCodeList)
      if (this.selectedDate && this.selectedDate !== null) {
        // 请求每一天的统计数据
        for (let i = 0; i < this.dateList.length; i++) {
        //  单天数据填充0
          for (let ci = 1; ci < codeList.length + 1; ci++) {
            this.chartOption.dataset.source[ci].push(0)
          }

          // 请求阅读海洋响应码数据
          YDHYresponseCodeCount({ sDate: this.dateList[i], eDate: this.dateList[i + 1] }).then((result) => {
            const data = result.data.data

            for (let di = 0; di < data.length; di++) {
              const codePos = this.responseCodeList[parseInt(data[di].code)]
              this.chartOption.dataset.source[codePos][i + 1] = parseInt(data[di].count)
            }
            this.drawChart()
          }).catch((err) => {
            console.log(err)
          })
        }
      } else {
        Message({
          message: '请先选择日期范围',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    // 获取七彩评价响应码统计数值
    getQCPJrespCode() {
      this.QCPJplain = false
      this.YDHYplain = true

      const codeList = Object.keys(this.responseCodeList)
      if (this.selectedDate && this.selectedDate !== null) {
        // 请求每一天的统计数据
        for (let i = 0; i < this.dateList.length; i++) {
          // 单天数据填充0
          for (let ci = 1; ci < codeList.length + 1; ci++) {
            this.chartOption.dataset.source[ci].push(0)
          }

          // 请求七彩评价响应码数据
          QCPJresponseCodeCount({ sDate: this.dateList[i], eDate: this.dateList[i + 1] }).then((result) => {
            const data = result.data.data

            for (let di = 0; di < data.length; di++) {
              const codePos = this.responseCodeList[parseInt(data[di].code)]
              this.chartOption.dataset.source[codePos][i + 1] = parseInt(data[di].count)
            }
            // 注意:这里的网络请都是异步操作
            // 画图操作放到外层,数据只有空数据;放里层绘制多次浪费资源(待修复)
            this.drawChart()
          }).catch((err) => {
            console.log(err)
          })
        }
      } else {
        Message({
          message: '请先选择日期范围',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    drawChart() {
      var myChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      myChart.on('updateAxisPointer', function(event) {
        const xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1
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
      myChart.setOption(this.chartOption)
    },
    // 初始化数据
    initData() {
      const codeList = Object.keys(this.responseCodeList)
      this.chartOption.dataset.source = []
      this.chartOption.dataset.source.push(['date'])
      for (let i = 0; i < codeList.length; i++) {
        this.chartOption.dataset.source.push([codeList[i]])
      }
    //   console.log(this.chartOption.dataset.source)
    }
  }
}
</script>

<style>
.bm-view {
  width: 100%;
  height: 650px;
}
</style>
