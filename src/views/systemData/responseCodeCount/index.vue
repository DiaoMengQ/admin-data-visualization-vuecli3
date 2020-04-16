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
        }]
      },
      selectedDate: '',
      dateList: [],

      QCPJplain: true,
      YDHYplain: true,

      // example: https://www.echartsjs.com/examples/zh/editor.html?c=dataset-link
      chartOption: {
        legend: {
          selected: { '200': false }
        },
        tooltip: {
          trigger: 'axis',
          showContent: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataset: {
          source: [
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: []
      }
    }
  },
  methods: {
    // 获取七彩评价响应码统计数值
    getQCPJrespCode() {
      this.QCPJplain = false
      this.YDHYplain = true

      if (this.selectedDate && this.selectedDate !== null) {
        QCPJresponseCodeCount({ sDate: this.selectedDate[0], eDate: this.selectedDate[1] }).then((result) => {
          this.dataProcess(result.data.data)
        })
      } else {
        Message({
          message: '请先选择日期范围',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    // 获取阅读海洋响应码统计数值
    getYDHYrespCode() {
      this.QCPJplain = true
      this.YDHYplain = false

      if (this.selectedDate && this.selectedDate !== null) {
        YDHYresponseCodeCount({ sDate: this.selectedDate[0], eDate: this.selectedDate[1] }).then((result) => {
          this.dataProcess(result.data.data)
        })
      } else {
        Message({
          message: '请先选择日期范围',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    drawChart() {
      echarts.init(document.getElementById('chart-main')).dispose()
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
      // console.log(this.chartOption)
      myChart.setOption(this.chartOption)
    },
    // c图表配置项
    initChartOption(codeList) {
      this.chartOption.dataset.source = []
      this.chartOption.dataset.source.push(['date'])
      this.chartOption.series = []
      for (let i = 0; i < codeList.length; i++) {
        this.chartOption.dataset.source.push([codeList[i].toString()])
        this.chartOption.series.push({ symbolSize: 5, type: 'line', smooth: true, seriesLayoutBy: 'row' })
      }

      if (this.selectedDate && this.selectedDate !== null) {
        this.dateList = getMiddleDateList(this.selectedDate[0], this.selectedDate[1])

        for (let i = 0; i < this.dateList.length; i++) {
          this.chartOption.dataset.source[0].push(this.dateList[i])
        }

        this.chartOption.series.push({
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '31%'],
          label: { formatter: '{b}: {@' + this.dateList[0] + '} ({d}%)' },
          encode: {
            itemName: 'date',
            value: this.dateList[0],
            tooltip: this.dateList[0] }
        })
      }
      // console.log('初始化', this.chartOption)
    },
    // 数据处理
    dataProcess(data) {
      console.log(data)
      const codeList = [] // 响应码列表

      // 统计一共有哪些验证码
      for (let i = 0; i < data.length; i++) {
        for (let di = 0; di < data[i].list.length; di++) {
          if (!codeList.includes(parseInt(data[i].list[di].code))) {
            codeList.push(parseInt(data[i].list[di].code))
          }
        }
      }

      this.initChartOption(codeList)

      for (let i = 0; i < data.length; i++) {
        // 单天数据的每一个响应码数量填充0
        for (let ci = 1; ci < codeList.length + 1; ci++) {
          this.chartOption.dataset.source[ci].push(0)
        }

        for (let di = 0; di < data[i].list.length; di++) {
          const codePos = codeList.indexOf(parseInt(data[i].list[di].code)) + 1 // 响应码在响应码表中的定位
          // console.log('定位', codePos, '响应码', parseInt(data[i].list[di].code))
          this.chartOption.dataset.source[codePos][i + 1] = parseInt(data[i].list[di].count)
        }
      }
      // console.log(this.chartOption.dataset.source)
      this.drawChart()
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
