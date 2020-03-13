<template>

  <div id="app-container">
    <div style="margin:20px;text-align: center;">
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
          <el-button type="primary" :plain="QCPJplain" @click="getQCPJcityData">七彩评价</el-button>
          <el-button type="primary" :plain="YDHYplain" @click="getYDHYcityData">阅读海洋</el-button>
        </el-button-group>
      </div>
    </div>

    <div id="chinaMap" ref="myEchart" style="height:800px;width:100%;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
import 'echarts/map/js/china.js' // 引入中国地图数据

import 'echarts/map/js/province/beijing.js' // 引入北京地图数据
import 'echarts/map/js/province/fujian.js' // 引入福建地图数据
import 'echarts/map/js/province/anhui.js' // 引入安徽地图数据
import 'echarts/map/js/province/xinjiang.js' // 引入新疆地图数据
import 'echarts/map/js/province/xizang.js' // 引入西藏地图数据

// 引入提示框和标题组件
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')

import { QCPJcityDistribution, YDHYcityDistribution, getAreaInfo } from '@/api/system'

export default {
  data() {
    return {
      selectedDate: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
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

      QCPJplain: true,
      YDHYplain: true,
      option: {
        backgroundColor: '#fff', // 设置背景颜色
        title: {
          show: true,
          text: '标题--中国地图',
          subtext: 'made by xzc',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        // 左侧小导航图标
        visualMap: {
          show: true,
          x: 'left',
          y: 'bottom',
          // splitList: [
          //   { start: 10, end: 20 },
          //   { start: 6, end: 10 },
          //   { start: 0, end: 6 }
          // ],
          // color: ['#1E90FF', '#7FFFAA', '#F0E68C']
          min: 0,
          max: 20,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            // color: ['lightskyblue', 'yellow', 'red']
            color: ['white', 'yellow', 'red']
          }
        },
        // 配置属性
        series: [{
          name: '数量',
          type: 'map',

          map: 'china',
          roam: false,
          zoom: 1.2,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: false
            }
          },
          data: []
        }]
      }
    }
  },
  mounted() {
    // this.drawChart()
    // this.chinaConfigure()
    // this.chinamap()
  },
  methods: {
    // 获取阅读海洋地区访问统计数值
    getYDHYcityData() {
      this.QCPJplain = true
      this.YDHYplain = false
      this.baiduMapOption.title.subtext = '数据来源: 阅读海洋'
      if (this.selectedDate === null || this.selectedDate.length === 0) {
        YDHYcityDistribution().then((result) => {
          const data = result.data.data
          // this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        YDHYcityDistribution({ date: this.selectedDate }).then((result) => {
          const data = result.data.data
          // this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 获取七彩评价地区访问统计数值
    getQCPJcityData() {
      // this.baiduMapOption.title.subtext = '数据来源: 七彩评价'
      this.QCPJplain = false
      this.YDHYplain = true
      // 注意判空的顺序
      if (this.selectedDate === null || this.selectedDate.length === 0) {
        QCPJcityDistribution().then((result) => {
          const data = result.data.data
          for (let i = 0; i < data.length; i++) {
            data[i].name = data[i].city
            data[i].value = data[i].count
            delete data[i].city
            delete data[i].count
          }
          this.option.series[0].data = data
          // console.log(data)
          this.chinamap()
          // this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        QCPJcityDistribution({ date: this.selectedDate }).then((result) => {
          const data = result.data.data
          // this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    // 绘制图形
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      var clusterChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      // 绘制图表
      if (this.option && typeof this.option === 'object') {
        clusterChart.setOption(this.option, true)
      }
    },

    chinamap() {
      var myChart = echarts.init(document.getElementById('chinaMap'))
      window.addEventListener('resize', function() {
        myChart.resize()
      })
      // this.option =

      console.log(this.option)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.option)

      // myChart.on('mouseover', function(params) {
      //   var dataIndex = params.dataIndex
      //   console.log(dataIndex)
      // })

      myChart.on('click', function(chinaParam) {
        var option = myChart.getOption()
        option.series[0].map = chinaParam.name
        option.series[0].mapType = chinaParam.name
        myChart.clear()
        console.log(chinaParam.name)
        myChart.setOption(option, true)
      })
    }
  }
}
</script>

<style>

</style>
