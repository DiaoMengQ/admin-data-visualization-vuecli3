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
  name: "TeaEvaAvgRadarChart",
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
      return Object.values(this.data).map(num => num.toFixed(0));
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
        self.makeRadarChart();
      });
    },
    makeRadarChart() {
      const radarChart = echarts.init(this.$refs.chart);
      // 清空echarts画布，避免图像重叠显示
      radarChart.clear();
      radarChart.setOption({
        title: {
          text: "基础雷达图"
        },
        radar: {
          //   shape: "circle",
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#2378f7",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: this.labels.map(label => {
            return {
              name: label,
            //   max: 100
            };
          })
        },
        series: [
          {
            name: "当周该班的积分情况",
            type: "radar",
            areaStyle: {
              normal: {
                opacity: 0.9,
                color: new echarts.graphic.RadialGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: [
              {
                value: this.values,
                name: "积分情况",
                symbolSize: 1,
                lineStyle: {
                  normal: {
                    color: "#2378f7"
                  }
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
                }
              }
            ]
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
