<template>
  <div id="app-container">
    <div style="margin:20px;text-align: center;">
      <el-button-group>
        <el-button type="primary" :plain="QCPJplain" @click="getQCPJdevicesData">七彩评价</el-button>
        <el-button type="primary" disabled :plain="YDHYplain" @click="getYDHYdevicesData">阅读海洋</el-button>
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

import { QCPJequipmentCount } from '@/api/system'

export default {
  data() {
    return {
      QCPJplain: false,
      YDHYplain: true,
      chartOption: {
        title: {
          text: '访问设备数据统计',
          subtext: '数据来源: 七彩评价',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getQCPJdevicesData()
  },
  methods: {
    // 获取阅读海洋地区访问统计数值(目前未提供接口,备用)
    getYDHYdevicesData() {
      this.drawChinaMap()

      this.QCPJplain = true
      this.YDHYplain = false
    },
    // 获取七彩评价地区访问统计数值
    getQCPJdevicesData() {
      QCPJequipmentCount().then((result) => {
        const data = result.data.data
        const devicesNameArr = []
        const devicesDataArr = []

        for (let i = 0; i < data.length; i++) {
          const val = data[i].count
          const name = data[i].equipment
          devicesNameArr.push(name)
          devicesDataArr.push({ value: val, name: name })
        }
        this.chartOption.legend.data = devicesNameArr
        this.chartOption.series[0].data = devicesDataArr

        this.drawChinaMap()
        this.QCPJplain = false
        this.YDHYplain = true
      }).catch((err) => {
        console.log(err)
      })
    },
    drawChinaMap() {
      var myChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      myChart.setOption(this.chartOption)
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
