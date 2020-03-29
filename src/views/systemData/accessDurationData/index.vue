<template>
  <div id="app-container" style="margin:20px;text-align:center;">
    <div>
      <el-date-picker
        v-model="selectedDate"
        align="right"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      />
      <el-button-group>
        <el-button type="primary" :plain="QCPJplain" @click="getQCPJTimeVisitCount">七彩评价</el-button>
        <el-button type="primary" :plain="YDHYplain" @click="getYDHYTimeVisitCount">阅读海洋</el-button>
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

import { getQCPJTimeVisitCount, getYDHYTimeVisitCount } from '@/api/system'

export default {
  data() {
    return {
      QCPJplain: true,
      YDHYplain: true,
      selectedDate: '',
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
  mounted() {
    // this.drawChart()
  },
  methods: {
    getQCPJTimeVisitCount() {
      this.QCPJplain = false
      this.YDHYplain = true
      getQCPJTimeVisitCount({ date: this.selectedDate }).then((result) => {
        this.dataHandle(result.data.data)
        this.drawChart()
      }).catch((err) => {
        console.log(err)
      })
    },
    getYDHYTimeVisitCount() {
      this.QCPJplain = true
      this.YDHYplain = false
      getYDHYTimeVisitCount({ date: this.selectedDate }).then((result) => {
        this.dataHandle(result.data.data)
        this.drawChart()
      }).catch((err) => {
        console.log(err)
      })
    },
    drawChart() {
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

      console.log(this.chartOption)
      return data
    }
  }
}
</script>

<style>

</style>
