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
    <div v-if="ifShowMap" id="mapContainer">
      <baidu-map
        ak="vgU1xLIOGzk8yPQkqW5xT8PylCwXfliW"
        class="bm-view"
        @ready="drawChinaMap"
      />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/extension/bmap/bmap'

import BaiduMap from 'vue-baidu-map/components/map/Map.vue'

// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import { QCPJcityDistribution, YDHYcityDistribution, getAreaInfo } from '@/api/system'

export default {
  components: { BaiduMap },
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
      ifShowMap: false,
      geoCoordMap: {
        '莱芜': [117.67, 36.19],
        '常德': [111.69, 29.05]
      },
      data: [
        { city: '莱芜', count: 148 },
        { city: '常德', count: 152 }
      ],
      mapChartOption: {
        title: {
          text: '用户访问区域统计信息',
          subtext: '数据来源: 七彩评价',
          sublink: 'http://www.pm25.in',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            const res = params.seriesName + '</br>' + params.marker + params.name + ': ' + params.value[2]
            return res
          }
        },
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [{
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#f3f3f3'
              }
            }, {
              'featureType': 'railway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'all',
              'stylers': {
                'color': '#fdfdfd'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'poi',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'green',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'subway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'manmade',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'local',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'all',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'building',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'label',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#999999'
              }
            }]
          }
        }
      },
      QCPJplain: true,
      YDHYplain: true
    }
  },
  created() {
    this.getAreaData()
  },
  methods: {
    getAreaData() {
      // 获取经纬度
      getAreaInfo().then((result) => {
        const tempGeoCoordMap = result.data.data
        const geoCoordMapItem = {}

        for (let i = 0; i < tempGeoCoordMap.length; i++) {
          // 处理字符串中的经纬度
          const LonAlatItem = tempGeoCoordMap[i].center.split(',')
          for (let j = 0; j < 2; j++) {
            LonAlatItem[j] = parseFloat(LonAlatItem[j])
          }

          // 生成城市数据单项
          const cityName = tempGeoCoordMap[i].cityName
          geoCoordMapItem[cityName] = LonAlatItem
        }
        this.geoCoordMap = geoCoordMapItem
        // console.log(this.geoCoordMap)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取阅读海洋地区访问统计数值
    getYDHYcityData() {
      this.QCPJplain = true
      this.YDHYplain = false
      this.mapChartOption.title.subtext = '数据来源: 阅读海洋'
      if (this.selectedDate === null || this.selectedDate.length === 0) {
        YDHYcityDistribution().then((result) => {
          this.data = result.data.data
          this.addChartOptionSeries(0.00007)
          this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        YDHYcityDistribution({ date: this.selectedDate }).then((result) => {
          this.data = result.data.data
          this.addChartOptionSeries(0.1)
          this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 获取七彩评价地区访问统计数值
    getQCPJcityData() {
      this.mapChartOption.title.subtext = '数据来源: 七彩评价'
      this.QCPJplain = false
      this.YDHYplain = true
      // 注意判空的顺序
      if (this.selectedDate === null || this.selectedDate.length === 0) {
        QCPJcityDistribution().then((result) => {
          this.data = result.data.data
          this.addChartOptionSeries(0.000007) // 默认获取所有日期数据时数据过大,传入倍率缩小描点显示大小
          this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        QCPJcityDistribution({ date: this.selectedDate }).then((result) => {
          this.data = result.data.data
          this.addChartOptionSeries(0.001)
          this.drawChinaMap()
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    addChartOptionSeries(mag) {
      this.mapChartOption.series = [
        {
          name: '访问次数:',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: this.convertData(this.data),
          symbolSize: function(val) {
            return val[2] * mag
          },
          label: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          itemStyle: {
            color: ' #00ccff'
          },
          emphasis: {
            label: {
              show: true
            }
          }
        },
        {
          name: '最多访问Top 5:',
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: this.convertData(this.data.sort(function(a, b) {
            return b.count - a.count
          }).slice(0, 6)),
          symbolSize: function(val) {
            return val[2] * mag
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          itemStyle: {
            color: '#39ac39',
            shadowBlur: 10,
            shadowColor: '#555'
          },
          zlevel: 1
        }
      ]
    },

    // 此处调用了两次 drawChinaMap() 方法(加载了两次地图),地图才得以显示
    // 我jio得应该是数据和地图请求顺序的问题
    // 但是我不知道怎么改_(:з」∠)_
    // 地图绘制
    drawChinaMap() {
      this.ifShowMap = true
      var myChart = echarts.init(document.getElementById('mapContainer'))
      myChart.setOption(this.mapChartOption)
    },

    // 原数据处理
    convertData(data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].city]
        if (geoCoord) {
          res.push({
            name: data[i].city,
            value: geoCoord.concat(data[i].count)
          })
        }
      }
      return res
    }
  }
}
</script>

<style>
#mapContainer{
  width: 90%;
  margin: auto;
  height: 650px
}
.bm-view {
  width: 100%;
  height: 650px;
}
</style>
