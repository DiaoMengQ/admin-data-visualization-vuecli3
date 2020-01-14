<template>
  <div>
    <!-- 穿梭表显示该班级的学生 -->
    <el-transfer v-model="value" :data="data" :titles="['该班级学生','所选学生']" style="width:500px;margin:0 auto;" @change="show()">
      <!-- <el-button slot="right-footer" class="transfer-footer" size="small" style="auto">执行</el-button> -->
    </el-transfer><p />
    <div ref="chart" style="width:850px;height:350px;margin:0 auto;" />
  </div></template>
<script>
// import store from '@/store/index.js'
import echarts from 'echarts'
import { getStuSemester } from '@/api/qcpj'
import 'echarts/theme/macarons'

export default {
  data() {
    const generateData = _ => {
      // 将上一个页面所存储起来的该班级学生放置到classStu中，方便后面使用
      const classStu = JSON.parse(sessionStorage.getItem('stu'))

      const data = []
      for (let i = 0; i < classStu.length; i++) {
        const name = classStu[i].name
        const id = classStu[i].studentId
        // console.log('~~~~')
        // console.log(t)
        // 将班级的学生姓名、学生ID传到name、id中，再将其放到data中作为data的key以及文本
        data.push({
          key: id,
          label: name
        })
      }
      return data
    }
    return {
      data: generateData(),
      value: []
    }
  },
  methods: {
    show() {
      // console.log(this.value)
      // console.log(this.value.length)
      // 将获取到的多名学生的各科成绩进行q处理
      const stuSub = []
      for (let i = 0; i < this.value.length; i++) {
        // 将所选到的学生的id分别传进choseid中方便后面使用
        var choseId = this.value[i]

        // console.log(i)
        getStuSemester({ 'studentId': choseId })
          .then(res => {
            // console.log(choseId)

            // 定义学生人文成绩
            const objData = []
            // 定义实践成绩
            const objSj = []
            // 定义科学成绩
            const objKx = []
            // 定义用来存存储周次的数据，在后面setOption出将其传入x轴作为x轴的data
            const weekArr = []

            // 将获取到的学生成绩存储到sessionStorage中
            const sub = res.data.data
            sessionStorage.setItem('classStusub', JSON.stringify(sub))
            // console.log(sub)
            // console.log('____________________________')

            // let _this = this

            // 先对获取到的数据进行处理
            // 有几周成绩，同时将获取到的字符串转换为obj，没有成绩的赋值为0
            for (var j = 0; j < sub.length; j++) {
            // console.log(sub[i].subType)

              /** 人文 */
              // 将获取到的字符串转为obj
              const obj = JSON.parse(sub[j].subType)
              if (obj['人文'] == null) {
                objData[j] = parseInt('0')
              } else {
              // 同时将获取到的每周人文转换为int，方便下方传入到图中data
                objData[j] = parseInt(obj['人文'])
              }
              // console.log(obj['人文'])

              /** 实践 */
              if (obj['实践'] == null) {
                objSj[j] = parseInt('0')
              } else {
              // 同时将获取到的每周实践转换为int，方便下方传入到图中data
                objSj[j] = parseInt(obj['实践'])
              }

              /** 科学 */
              if (obj['科学'] == null) {
                objKx[j] = parseInt('0')
              } else {
              // 同时将获取到的每周科学转换为int，方便下方传入到图中data
                objKx[j] = parseInt(obj['科学'])
              }
              // 将周次传入到weekArr数组中，以便将周次实时同步q
              weekArr[j] = ['第' + (j + 1) + '周']
            }

            stuSub[i] = objData
            //
            // console.log(sessionStorage.getItem('stuSubRw'))
            // console.log(JSON.parse(sessionStorage.getItem('stuSubRw')))
          })
      }
      // 异步将数据放入stuSub中
      setTimeout(() =>
      // console.log(stuSub)
        sessionStorage.setItem('stuSubRw', JSON.stringify(stuSub))
      , 600)
      console.log(JSON.parse(sessionStorage.getItem('stuSubRw'))[0])

      const myChart = echarts.init(this.$refs.chart, 'macarons')

      // 折线图属性设置
      myChart.setOption({
        title: { text: '本学期人文成绩' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          data: ['黎子男', '郑俊熙', '胡旅冰']
        },
        series: []
      })

      // 将处理好的数据传入表中
      myChart.setOption({
        series: [
          {
            name: '黎子男',
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[0]
          },
          {
            name: '郑俊熙',
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[1]
          },
          {
            name: '胡旅冰',
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[2]
          }
        //   {
        //     name: '实践',
        //     type: 'line',
        //     areaStyle: {},
        //     data: objSj
        //   },
        //   {
        //     name: '科学',
        //     type: 'line',
        //     areaStyle: {},
        //     data: objKx
        //   }
        ],
        xAxis: {
          data: this.weekArr
        }
      })
    }
  }
}
</script>
<style lang="">

</style>

