<template>
  <div id="app">
    <div class="nav">
      <school-picker v-model="schoolId" @update="getData" />
      <YDHYClassPicker v-model="classId" :school-id="schoolId" class="class-picker" @update="getData" />
      <div class="nav-other">
        <div class="slider-wrapper item">
          <span class="desc">分数段选择</span>
          <el-slider v-model="scores" class="slider" :max="5" range @change="getData" />
        </div>
        <book-type-picker v-model="bookType" class="item" @update="getData" />
      </div>
    </div>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:90%;height:90%;margin:0 auto;min-height:500px;min-width:800px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import SchoolPicker from '@/components/class/SchoolPicker'
import YDHYClassPicker from '@/components/class/YDHYClassPicker'
import BookTypePicker from '@/components/class/BookTypePicker'

import { getReadHabitByClass } from '@/api/ydhy'

export default {
  name: 'RoBarChart',
  components: { YDHYClassPicker, BookTypePicker, SchoolPicker },
  data() {
    return {
      schoolId: '',
      classId: '', // 当前班级Id,
      bookType: '', // 当前选中的书类型
      scores: [0, 100], // 分数
      data: {} // 数据
    }
  },
  computed: {
    historyAvg() {
      if (!this.data.length) return []
      // 双重循环，外层学生，内层每次的成绩，求出每次的总和
      const avg = new Array(JSON.parse(this.data[0].historyScore).length).fill(0)
      for (const i of this.data) {
        const userHistoryScores = JSON.parse(i.historyScore)
        for (let y = 0; y < userHistoryScores.length; y++) {
          avg[y] += userHistoryScores[y]
        }
      }
      console.log(avg)
      // 此处用总和/班上学生数得到均值
      return avg.map(i => (i / this.data.length).toFixed(2))
    },
    historyName() {
      if (!this.data.length) return []
      const len = JSON.parse(this.data[0].historyScore).length
      // 生成x轴的标签
      return new Array(len).fill('').map((item, index) => `第${index + 1}次`)
    }
  },
  watch: {},
  mounted() {},
  methods: {
    getData() {
      getReadHabitByClass({ bookType: this.bookType, classId: this.classId, endScore: this.scores[1], startScore: this.scores[0] }).then(res => {
        this.data = res.data.data
        this.makeLineChart()
      })
    },
    makeLineChart() {
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
          data: this.historyAvg,
          type: 'line',
          lineStyle: {
            color: '#2378f7'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            emphasis: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          }
        }]

      }
      )
    }
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-around;
  box-sizing: border-box;
  padding: 20px;
}
.nav-other{
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
}
.slider-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.slider {
    width: 100%;
}
.item {
    flex: 1;
    margin: 20px 20px;
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
