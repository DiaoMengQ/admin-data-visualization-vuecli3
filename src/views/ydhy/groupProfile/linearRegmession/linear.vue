<template>
  <div id="app">
    <school-picker v-model="schoolId" @update="getData" />
    <book-type-picker v-model="bookType" @update="getData" />
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:90%;height:90%;margin:0 auto;min-height:500px;min-width:800px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import ecStat from 'echarts-stat'
import BookTypePicker from '@/components/class/BookTypePicker'
import SchoolPicker from '@/components/class/SchoolPicker'
import { getSchoolReadingReg } from '@/api/ydhy'

export default {
  name: 'RoBarChart',
  components: { BookTypePicker, SchoolPicker },
  data() {
    return {
      schoolId: '', // 当前学校Id,
      bookType: '', // 当前选中的书类型
      data: {} // 数据
    }
  },
  computed: {
    wrappedData() {
      const data = []
      for (const i of this.data) {
        // 对单个用户的历史得分进行循环，包装成【周，分】的点
        const historys = JSON.parse(i.historyScore).map((item, index) => {
          return [index + 1, item]
        })
        data.push(...historys)
      }
      return data
    },
    vals() {
      // 放进去求出回归方程需要的参数
      return ecStat.regression('linear', this.wrappedData)
    }
  },
  watch: {},
  mounted() {},
  methods: {
    getData() {
      getSchoolReadingReg({ bookType: this.bookType, schoolId: this.schoolId }).then(res => {
        this.data = res.data.data
        this.makeLineChart()
      })
    },
    makeLineChart() {
      const myRegression = ecStat.regression('linear', this.wrappedData)
      myRegression.points.sort(function(a, b) { return a[0] - b[0] })
      const barChart = echarts.init(this.$refs.chart)
      // 清空echarts画布，避免图像重叠显示
      barChart.clear()
      barChart.setOption({
        // title: { text: `班级阅读任务统计` },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.historyName,
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#222'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          type: 'value'
        },
        smooth: true,
        tooltip: {
          trigger: 'item',
          formatter: '{b}: 平均{c}'
        },
        series: [{
          name: 'scatter',
          type: 'scatter',
          emphasis: {
            label: {
              show: true,
              position: 'left',
              color: 'blue',
              fontSize: 16
            }
          },
          data: this.wrappedData
        }, {
          name: 'line',
          type: 'line',
          showSymbol: false,
          data: myRegression.points,
          markPoint: {
            itemStyle: {
              color: 'transparent'
            },
            label: {
              show: true,
              position: 'left',
              formatter: myRegression.expression,
              color: '#333',
              fontSize: 14
            },
            data: [{
              coord: myRegression.points[myRegression.points.length - 1]
            }]
          }
        }]
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 1.8em;
}
</style>
