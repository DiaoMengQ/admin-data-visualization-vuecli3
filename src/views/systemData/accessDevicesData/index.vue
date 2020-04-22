<!-- 系统访问设备统计 -->
<template>
  <div id="app-container">
    <div style="margin:20px;text-align: center;">
      <el-radio-group v-model="selectedType" style="margin:20px 20px 0 20px">
        <el-radio label="devices">设备访问</el-radio>
        <el-radio label="browsers">浏览器访问</el-radio>
      </el-radio-group>
      <div>
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
          <el-button type="primary" :plain="QCPJplain" @click="getQCPJdevicesData">七彩评价</el-button>
          <el-button type="primary" :plain="YDHYplain" @click="getYDHYdevicesData">阅读海洋</el-button>
        </el-button-group>
      </div>
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

import { QCPJequipmentCount, YDHYequipmentCount, getQCPJbrowserCount, getYDHYbrowserCount } from '@/api/system'
import { MessageBox } from 'element-ui'

export default {
  data() {
    return {
      selectedType: 'devices', // 所查询访问平台类型
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
      selectedDate: null,

      QCPJplain: true,
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
        toolbox: {
          feature: {
            saveAsImage: {}
          }
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
    this.JudgeManaRange()
  },
  methods: {
    // 用户权限判断
    JudgeManaRange() {
      switch (this.$store.state.user['roleType']) {
        case 'SUPER_ADMIN':
          break
        default:
          MessageBox.confirm('抱歉，您没有权限查看当前页面', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(() => {
            this.$router.push('/home')
          }).catch(() => {
            this.$router.push('/home')
          })
          break
      }
    },
    // 获取阅读海洋地区访问统计数值
    getYDHYdevicesData() {
      this.QCPJplain = true
      this.YDHYplain = false

      let param = null
      if (!this.selectedDate) {
        param = null
      } else {
        param = { sDate: this.selectedDate[0], eDate: this.selectedDate[1] }
      }

      switch (this.selectedType) {
        case 'devices':
          YDHYequipmentCount(param).then((result) => {
            this.dataHandle(result.data.data)
            this.drawChinaMap()
          }).catch((err) => {
            console.log(err)
          })
          break
        case 'browsers':
          getYDHYbrowserCount(param).then((result) => {
            this.dataHandle(result.data.data)
            this.drawChinaMap()
          }).catch((err) => {
            console.log(err)
          })
          break
        default:
          break
      }
    },
    // 获取七彩评价地区访问统计数值
    getQCPJdevicesData() {
      this.QCPJplain = false
      this.YDHYplain = true

      let param = null
      if (!this.selectedDate) {
        param = null
      } else {
        param = { sDate: this.selectedDate[0], eDate: this.selectedDate[1] }
      }

      switch (this.selectedType) {
        case 'devices':
          QCPJequipmentCount(param).then((result) => {
            this.dataHandle(result.data.data)
            this.drawChinaMap()
          }).catch((err) => {
            console.log(err)
          })
          break
        case 'browsers':
          getQCPJbrowserCount(param).then((result) => {
            this.dataHandle(result.data.data)
            this.drawChinaMap()
          }).catch((err) => {
            console.log(err)
          })
          break
        default:
          break
      }
    },
    drawChinaMap() {
      echarts.init(document.getElementById('chart-main')).dispose()
      var myChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      myChart.setOption(this.chartOption)
    },
    dataHandle(data) {
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
