<template>
  <div id="app">
    <div class="nav">
      <class-picker class="class-picker" v-model="classId" @update="getData" />
      <el-input-number
        class="week-picker"
        v-model="week"
        :min="1"
        :max="14"
        label="周数"
        @change="getData"
      ></el-input-number>
    </div>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:90%;height:90%;margin:0 auto;min-height:500px;min-width:800px;" />
  </div>
</template>

<script>
import echarts from "echarts";
import ClassPicker from "@/components/class/ClassPicker";
import { getClassTeaEvaAvg } from "@/api/qcpj";

export default {
  name: "TeaEvaAvgLineChart",
  components: { ClassPicker },
  data() {
    return {
      classId: "", // 当前班级Id,
      week: 1, // 周数
      data: {} // 数据
    };
  },
  computed: {
    labels() {
      return Object.keys(this.data);
    },
    values() {
      return Object.values(this.data).map(num => num.toFixed(2));
    },
    shadows() {
      return new Array(this.data.length).fill(500);
    }
  },
  watch: {},
  mounted() {},
  methods: {
    getData() {
      const self = this;
      getClassTeaEvaAvg({
        classId: this.classId,
        week: this.week
      }).then(res => {
        self.data = JSON.parse(res.data.data.score);
        self.makeLineChart();
      });
    },
    makeLineChart() {
      const lineChart = echarts.init(this.$refs.chart);
      // 清空echarts画布，避免图像重叠显示
      lineChart.clear();
      lineChart.setOption({
        title: { text: `第${this.week}周平均积分` },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          data: this.labels,
          type: "category",
          axisLabel: {
            inside: false,
            textStyle: {
              color: "#222"
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
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          },
          max: 100
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            type: "line",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            lineStyle: {
                color: "#2378f7"
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: this.values
          }
        ]
      });
    }
  }
};
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
  display: inline-flex;
  justify-content: center;
  align-items: space-around;
  box-sizing: border-box;
  padding: 20px;
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
