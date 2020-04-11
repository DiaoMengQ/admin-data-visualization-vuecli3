<template>
  <div id="app">
    <school-picker v-model="schoolId" />
    <YDHYClassPicker v-model="classId" :school-id="schoolId" class="class-picker" @update="getData" />
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:90%;height:90%;margin:0 auto;min-height:500px;min-width:800px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
import YDHYClassPicker from '@/components/class/YDHYClassPicker'
import SchoolPicker from '@/components/class/SchoolPicker'

import { getReadingMessionByClass } from '@/api/ydhy'

export default {
  name: 'RoPieChart',
  components: { YDHYClassPicker, SchoolPicker },
  data() {
    return {
      schoolId: '',
      classId: '', // 当前班级Id,
      data: {} // 数据
    }
  },
  computed: {
    finishAvg() {
      let num = 0
      for (const user of this.data) {
        num = user.finishNum + num
      }
      return num
    },
    unfinishAvg() {
      let num = 0
      for (const user of this.data) {
        num = user.unfinishNum + num
      }
      return num
    },
    overdueAvg() {
      let num = 0
      for (const user of this.data) {
        num = user.overdueNum + num
      }
      return num
    },
    labels() {
      return Object.keys(this.data)
    },
    values() {
      return Object.values(this.data).map(num => num.toFixed(2))
    },
    shadows() {
      return new Array(this.data.length).fill(500)
    }
  },
  watch: {},
  mounted() {},
  methods: {
    // 获取子组件传入的classId
    getData() {
      getReadingMessionByClass(this.classId).then(res => {
        this.data = res.data.data
        this.makePieChart()
      })
    },
    makePieChart() {
      const barChart = echarts.init(this.$refs.chart, 'macarons')
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['已完成', '未完成', '已过期']
        },
        series: [
          {
            name: '完成情况',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.finishAvg, name: '已完成' },
              { value: this.unfinishAvg, name: '未完成' },
              { value: this.overdueAvg, name: '已过期' }
            ]
          }
        ]
      }
      )
    }
  }
}
</script>

<style scoped>
#app {
  padding: 1.8em;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.class-picker {
  flex: 2;
}
.week-picker {
  flex: 1;
  margin-left: 20px;
  margin-bottom: -5px;
}
</style>
