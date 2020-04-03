<!-- 用户访问区域统计 -->
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
// 引入中国地图数据
import 'echarts/map/js/china.js'
// 引入省份地图
import 'echarts/map/js/province/anhui.js'
import 'echarts/map/js/province/aomen.js'
import 'echarts/map/js/province/beijing.js'
import 'echarts/map/js/province/chongqing.js'
import 'echarts/map/js/province/fujian.js'
import 'echarts/map/js/province/gansu.js'
import 'echarts/map/js/province/guangdong.js'
import 'echarts/map/js/province/guangxi.js'
import 'echarts/map/js/province/guizhou.js'
import 'echarts/map/js/province/hainan.js'
import 'echarts/map/js/province/hebei.js'
import 'echarts/map/js/province/heilongjiang.js'
import 'echarts/map/js/province/henan.js'
import 'echarts/map/js/province/hubei.js'
import 'echarts/map/js/province/hunan.js'
import 'echarts/map/js/province/jiangsu.js'
import 'echarts/map/js/province/jiangxi.js'
import 'echarts/map/js/province/jilin.js'
import 'echarts/map/js/province/liaoning.js'
import 'echarts/map/js/province/neimenggu.js'
import 'echarts/map/js/province/ningxia.js'
import 'echarts/map/js/province/qinghai.js'
import 'echarts/map/js/province/shandong.js'
import 'echarts/map/js/province/shanghai.js'
import 'echarts/map/js/province/shanxi.js'
import 'echarts/map/js/province/shanxi1.js'
import 'echarts/map/js/province/sichuan.js'
import 'echarts/map/js/province/taiwan.js'
import 'echarts/map/js/province/tianjin.js'
import 'echarts/map/js/province/xianggang.js'
import 'echarts/map/js/province/xinjiang.js'
import 'echarts/map/js/province/xizang.js'
import 'echarts/map/js/province/yunnan.js'
import 'echarts/map/js/province/zhejiang.js'

// 引入提示框和标题组件
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')

import { QCPJcityDistribution, QCPJprovDistribution, YDHYcityDistribution, YDHYprovDistribution } from '@/api/system'

export default {
  data() {
    return {
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

      QCPJplain: true,
      YDHYplain: true,
      option: {
        backgroundColor: '#fff', // 设置背景颜色
        title: {
          show: true,
          text: '用户访问区域统计',
          subtext: 'made by xzc',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        // 左侧小导航图标
        visualMap: [{
          show: true,
          x: 'left',
          y: 'bottom',
          min: 0,
          max: 20,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['white', 'yellow', 'red']
          }
        }],
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
  },
  methods: {
    // 对请求的省份数据进行处理
    handleMapData(data) {
      // 设置地名的数值
      this.option.series[0].data = data

      const countList = []
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i].name, data[i].value)
        countList.push(data[i].value)
      }
      // 设置地图左下角热力对照条的最大值和最小值
      this.option.visualMap[0].min = Math.min.apply(Math, countList)
      this.option.visualMap[0].max = Math.max.apply(Math, countList)

      this.drawVectorMap()
    },
    // 获取阅读海洋地区访问统计数值
    getYDHYcityData() {
      this.option.title.subtext = '数据来源: 阅读海洋'
      this.QCPJplain = true
      this.YDHYplain = false

      let para = null
      if (this.selectedDate) {
        para = { date: this.selectedDate }
      }

      YDHYprovDistribution(para).then((result) => {
        this.handleMapData(result.data.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取七彩评价地区访问统计数值
    getQCPJcityData() {
      this.option.title.subtext = '数据来源: 七彩评价'
      this.QCPJplain = false
      this.YDHYplain = true

      let para = null
      if (this.selectedDate) {
        para = { date: this.selectedDate }
      }

      QCPJprovDistribution(para).then((result) => {
        this.handleMapData(result.data.data)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 绘制矢量地图
    drawVectorMap() {
      var myChart = echarts.init(document.getElementById('chinaMap'))
      window.addEventListener('resize', function() {
        myChart.resize()
      })

      // 使用刚指定的配置项和数据显示图表。
      myChart.clear() // 用于清除城市地图上设置的数据
      myChart.setOption(this.option)

      const selectedDate = this.selectedDate // 所选时间

      // 判断当前所选平台
      let selected = ''
      if (this.YDHYplain === true && this.QCPJplain === false) {
        selected = 'QCPJ'
      } else if (this.YDHYplain === false && this.QCPJplain === true) {
        selected = 'YDHY'
      }

      const provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门', '台湾']
      // 判断当前要加载的地图是不是省
      const isProvince = (name) => {
        return provincesText.some((province) => {
          return province === name
        })
      }

      // 画图
      const drawMap = (data, chinaParamName) => {
        const option = myChart.getOption()

        // 设置地名的数值
        option.series[0].data = data

        // 设置地图左下角热力对照条的最大值和最小值
        const countList = []
        for (let i = 0; i < data.length; i++) { countList.push(data[i].value) }
        option.visualMap[0].min = Math.min.apply(Math, countList)
        option.visualMap[0].max = Math.max.apply(Math, countList)

        // 设置显示的地图
        option.series[0].map = chinaParamName
        option.series[0].mapType = chinaParamName

        myChart.clear()
        myChart.setOption(option, true)
      }

      // 点击省份的单个块跳转至省级地图
      myChart.on('click', function(chinaParam) {
        // console.log('点击地图事件', chinaParam)
        if (isProvince(chinaParam.name)) {
          const para = { province: chinaParam.name }
          if (selectedDate) {
            para.date = selectedDate
          }

          switch (selected) {
            case 'QCPJ':
              QCPJcityDistribution(para).then((result) => {
                drawMap(result.data.data, chinaParam.name)
              }).catch((err) => {
                console.log(err)
              })
              break
            case 'YDHY':
              YDHYcityDistribution(para).then((result) => {
                drawMap(result.data.data, chinaParam.name)
              }).catch((err) => {
                console.log(err)
              })
              break
            default:
              break
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
