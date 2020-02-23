<template>
  <div class="app-container">

    <!-- <el-tag>任务ID: {{ taskId }} {{ taskDetail.taskName }}</el-tag> -->
    <!-- <span>{{ taskDetail }}</span> -->

    <div id="chart-main" ref="chart" style="width:800px;height:600px;margin:0 auto;" />

  </div>
</template>

<script>
import { handleData2arr, str2num, str2json } from '@/utils/index'

// 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts') 两种方式皆可
import echarts from 'echarts'
import 'echarts/theme/macarons'
// eslint-disable-next-line no-unused-vars
import { getSubjectClusterDetail } from '@/api/qcpj'

// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  data() {
    return {
      taskId: '',
      taskDetail: {
        id: 280357898402398200,
        userId: 2136974700880,
        taskName: '2年级3班的聚类任务2020-2-13',
        k: 3,
        handleData: '[[375,406],[640,571],[630,485],[400,445],[510,550],[615,585],[515,345],[485,625],[650,600],[520,476],[420,405],[630,706],[370,195],[630,656],[545,385],[460,416],[565,425],[690,620],[520,430],[400,350],[545,200],[380,401],[570,368],[750,741],[450,590],[510,525],[440,415],[320,255],[400,315],[445,490],[445,441],[555,660],[225,281],[615,476],[410,515],[395,420],[560,661],[740,681],[505,556],[465,550],[535,565],[515,435],[630,639],[490,375],[565,390],[470,616],[675,576],[355,270],[320,155],[320,165]]',
        resultData: '[2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 0, 1, 0, 2, 2, 2, 0, 2, 2, 1, 2, 2, 0, 0, 2, 2, 1, 1, 2, 2, 0, 1, 0, 2, 2, 0, 0, 0, 2, 0, 2, 0, 2, 2, 0, 0, 1, 1, 1]',
        weekRange: '[1,2,3,4,5,6,7,8,9,10]',
        subjectRange: '["德育","语文"]',
        studentList: '[{"u_id":"03f175d5-d631-43bd-89a5-270b93612c4f","u_name":"郑峻熙"},{"u_id":"cd05757c-f2fd-4186-9f5a-73da4230a20b","u_name":"骆图晟"},{"u_id":"61a2ad14-b237-4df6-92db-d92020c6c349","u_name":"刘若蓝"},{"u_id":"95ca6c77-fe86-40b5-b416-a93669f9a9e9","u_name":"王俊皓"},{"u_id":"c87572fc-d88a-48fc-a34c-80f4cb52cf82","u_name":"甘正"},{"u_id":"5cd603f0-227f-470b-b88e-894844ce56d8","u_name":"吴翼萱"},{"u_id":"d0bc08e2-aa2d-4fc6-bba8-3587ccf13426","u_name":"王子涵"},{"u_id":"28ef146c-2e76-400f-b23d-04b5b4deb1a5","u_name":"韦玥芯"},{"u_id":"35d36a7a-c5a7-41f6-a5ef-db8f841fb56c","u_name":"许子轩"},{"u_id":"be2cbcf9-4087-4105-b93f-4fe28f298fc2","u_name":"叶锶蕊"},{"u_id":"b6b2a8b5-5836-4b59-9392-7c3a59774bab","u_name":"黄佳淇"},{"u_id":"804ac5ad-6690-4b04-8e22-2ef58354017f","u_name":"崔逸臣"},{"u_id":"3f30da1f-43d9-4eb9-ab4d-51964f1a62cd","u_name":"杨骐铭"},{"u_id":"ca50a3d1-eb7f-402c-a38b-496a8174e6e9","u_name":"王淅"},{"u_id":"5e60d21e-be19-4f6b-ae08-2c75c90150e6","u_name":"李嫣然"},{"u_id":"86c387d5-be2c-460f-97e2-d9b761b59e60","u_name":"曾子嫣"},{"u_id":"e90f368c-6d68-47dc-81bb-6f67b0eb1db1","u_name":"潘德林"},{"u_id":"e0b4009a-8cee-44d5-a34d-5b547d9672b7","u_name":"黄悦宸"},{"u_id":"bcd92dca-88ed-438d-b7e8-dc88e9173661","u_name":"肖芷柔"},{"u_id":"45a54762-bc8f-4a00-8a90-183c8dd40558","u_name":"黄佳泠"},{"u_id":"4eb66f78-6d41-4576-9a5d-2ecb584f4ab7","u_name":"史文淇"},{"u_id":"adf407eb-f395-4efd-859c-a56addc0ec28","u_name":"方添锦"},{"u_id":"a3b1636a-d458-4cf0-8f3d-09a72ad5d304","u_name":"苏一灐"},{"u_id":"387a3fd0-84f8-45d9-bea8-85c7d88f3d5c","u_name":"高蓝青"},{"u_id":"27c09f3e-2983-442e-8e70-8fea081fd899","u_name":"邓圣垲"},{"u_id":"b855507a-6997-4c3b-9104-d1f40f17c285","u_name":"刘茁翼"},{"u_id":"bcc80450-3392-41de-895a-df63ae675bdd","u_name":"崔子睿"},{"u_id":"14df6138-4a90-40d0-93dc-e791e3203121","u_name":"毛雅琳"},{"u_id":"921c8a51-218d-4a7c-b177-71ce7fe43d76","u_name":"李幸和"},{"u_id":"de9d4e0c-45eb-40bc-87d1-65d14c334185","u_name":"高健钊"},{"u_id":"78dda513-f8ad-4132-898c-1f7b2f550dc1","u_name":"郭奕婷"},{"u_id":"6b463934-b908-4cb0-b621-a8e68df80016","u_name":"林杰"},{"u_id":"94a79e3e-61b5-442a-ad20-7bc1caff924d","u_name":"滕致"},{"u_id":"ac8d8db1-6a18-4b55-a1e6-9393291c8b48","u_name":"王梓聿"},{"u_id":"8633700b-f062-43b6-8d14-5ea06ab3c6b4","u_name":"黄静宜"},{"u_id":"d7577f55-71b1-4dbf-87e8-f8c404fb3c36","u_name":"曾凡荣"},{"u_id":"0f922294-8fc3-4ce2-8cb3-ae4bc853c0e9","u_name":"胡旅冰"},{"u_id":"c869270d-4cbf-4167-a845-f36637e6849d","u_name":"张奕晨"},{"u_id":"dab1156c-85c9-42cb-83d9-b53345101670","u_name":"刘壮翼"},{"u_id":"f63373f0-e100-49dc-adaf-09079b942e37","u_name":"宾雪"},{"u_id":"bdc13de7-42e7-472c-938d-c0662d61b25f","u_name":"叶姿均"},{"u_id":"016e8f16-0057-4663-b50d-cf689afc1ce6","u_name":"黎子男"},{"u_id":"7a8c9a42-6396-4270-a8a3-63f5a95b8aea","u_name":"邓雅欣"},{"u_id":"13f04ce2-6ed0-4c97-afe9-900d6d568894","u_name":"陈锦菱"},{"u_id":"15fd8a0e-818c-490e-a1e4-26d8f14ab74e","u_name":"陈茂珊"},{"u_id":"3f5407f8-2f73-4590-9938-6a2cf4e7ef47","u_name":"乔汉纾"},{"u_id":"475e4ca6-f82c-4c50-ac5c-d8b905c82fdf","u_name":"王芷宜"},{"u_id":"f415c0ce-4921-4f92-9f08-51b101cced93","u_name":"梁颢腾"},{"u_id":"f623ebb2-8f10-417f-be80-4d4862f121a3","u_name":"吴家辉"},{"u_id":"201611-8f49-4117-895d-7742f259598d","u_name":"学生201601"}]',
        chScore: 64.4060043855776,
        curStatus: 1,
        msg: '完成',
        remarks: '',
        createTime: '2020-02-13 15:22:11.0',
        runTime: 0.0373468399047851,
        finishTime: '2020-02-13 15:22:11.0'
      },
      option: {
        title: {
          text: '总成绩分布',
          subtext: '(数字顺序不表示任何性质的排序)'
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          showDelay: 0,
          formatter: '',
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          }
        },
        toolbox: {
          feature: {
            dataZoom: {},
            brush: {
              type: ['rect', 'polygon', 'clear']
            }
          }
        },
        brush: {
        },
        legend: {
          data: [],
          left: 'center'
        },
        xAxis: [
          {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value} '
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: []
      }
    }
  },
  created() {
    this.taskId = this.$route.params && this.$route.params.taskId
  },
  mounted: function() {
    // 基于准备好的dom，初始化echarts实例
    var clusterChart = echarts.init(document.getElementById('chart-main'))

    // this.taskDetailInit()
    this.DataHandler()
    this.chartOptionAssignment()

    // 绘制图表
    if (this.option && typeof this.option === 'object') {
      clusterChart.setOption(this.option, true)
    }
  },
  methods: {
    // 获取任务详情数据
    taskDetailInit() {
      // eslint-disable-next-line no-unused-vars
      const tID = 280357898402398208
      // getSubjectClusterDetail(tID).then((result) => {
      getSubjectClusterDetail(this.taskId).then((result) => {
        this.taskDetail = result.data.data
        console.log(this.taskDetail)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 数据处理
    DataHandler() {
      // 科目数组信息处理
      // '["德育","语文"]'
      let sr = this.taskDetail.subjectRange
      sr = sr.replace('["', '')
      sr = sr.replace('"]', '')
      sr = sr.replace('","', ',')
      sr = sr.split(',')
      this.taskDetail.subjectRange = sr

      // 对科目待处理剧进行处理
      // '[[375,406],[640,571]]'
      let hd = this.taskDetail.handleData
      hd = hd.replace('[[', '')
      hd = hd.replace(']]', '')
      hd = hd.split('],[')
      hd = hd.map(handleData2arr) // 对数组中的每一个字符串数组进行处理
      this.taskDetail.handleData = hd

      // 对结果数据进行处理
      // '[2, 0, 0]'
      let td = this.taskDetail.resultData
      td = td.replace('[', '')
      td = td.replace(']', '')
      td = td.split(',')
      td = td.map(str2num)
      this.taskDetail.resultData = td

      // 对学生列表 json 数组的字符串进行处理
      // '[{"u_id":"03f175d5-d631-43bd-89a5-270b93612c4f","u_name":"郑峻熙"}]'
      let sl = this.taskDetail.studentList
      sl = sl.replace('[{', '')
      sl = sl.replace('}]', '')
      sl = sl.split('},{')
      sl = sl.map(str2json)
      this.taskDetail.studentList = sl
    },
    // 将数据赋给chart option
    chartOptionAssignment() {
      const tempTypes = [] // 聚类集合
      const typePos = new Array(this.taskDetail.k) // 每种集合的学生在数组中的位置
      const Series_sum = new Array(this.taskDetail.k) // 每种集合的原始数据
      const Series_stu = new Array(this.taskDetail.k) // 每种集合的学生数据

      // 定位集合数据变量初始化
      for (let i = 0; i < this.taskDetail.k; i++) {
        tempTypes.push(i.toString())
        typePos[i] = []
        Series_sum[i] = []
        Series_stu[i] = []
      }
      // 类型定位
      this.taskDetail.resultData.forEach(function(value, key) {
        typePos[value].push(key)
      })

      // 根据定位给原始数据和学生列表分类
      typePos.forEach((pos, posKey) => {
        pos.forEach((value, key) => {
          Series_sum[posKey].push(this.taskDetail.handleData[value])
          Series_stu[posKey].push(this.taskDetail.studentList[value])
        })
      })

      this.option.legend.data = tempTypes
      this.option.series = []
      // 自动生成某一类的数据集
      for (let i = 0; i < this.taskDetail.k; i++) {
        const SeriesItem = {
          name: i, // 应与 legend.data 的其中一项一致
          type: 'scatter',
          data: Series_sum[i],
          markArea: {
            silent: true,
            itemStyle: {
              color: 'transparent',
              borderWidth: 1,
              borderType: 'dashed'
            },
            data: [[{
              name: i + ' 集合分布区间',
              xAxis: 'min',
              yAxis: 'min'
            }, {
              xAxis: 'max',
              yAxis: 'max'
            }]]
          },
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            lineStyle: {
              type: 'solid'
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }

        this.option.series.push(SeriesItem)
      }

      const subRange = this.taskDetail.subjectRange
      this.option.tooltip.formatter = function(params) {
        let tooltipStr = ''
        const itemSeriesIndex = params.seriesIndex // 该点的所属类别
        const itemDataIndex = params.dataIndex // 该点在类别集合中的定位
        if (params.value.length > 1) {
          tooltipStr = Series_stu[itemSeriesIndex][itemDataIndex].u_name + ' :<br/>'
          subRange.forEach((sub, subIndex) => {
          // '德育' + ': ' + params.value[0] + '分<br/>' +
            tooltipStr += sub + ': ' + params.value[subIndex] + '分<br/>'
          })
          return tooltipStr
        } else {
          return params.name + ' : ' +
                params.value + '分 '
        }
      }
    }
  }
}
</script>

<style>
.app-container{
    margin: 20px
}
</style>
