<template>
  <div>
    <!-- 穿梭表显示该班级的学生 -->
    <div style="margin-left:27%;height:300px">
      <el-transfer
        v-model="value"
        :data="data"
        :titles="['该班级学生', '所选学生']"
        style="float:left;"
        @change="show()"
      >
        <!-- <el-button slot="right-footer" class="transfer-footer" size="small" style="auto">执行</el-button> -->
      </el-transfer>
      <el-radio-group v-model="choseSub" style="float:left">
        <el-radio-button label="人文" /><br>
        <el-radio-button label="科学" /><br>
        <el-radio-button label="实践" />
      </el-radio-group>
    </div>
    <div>
      <div ref="chart" style="width:850px;height:350px;margin:0 auto;" />
    </div></div></template>
<script>
// import store from '@/store/index.js'
import echarts from 'echarts'
import { getStuSemester } from '@/api/qcpj'
import 'echarts/theme/macarons'

export default {
  data() {
    return {
      // data: generateData(),
      data: [],
      // 获取所选择学生的ID
      value: [],
      // 获取所选择的科目
      choseSub: ''
    }
  },
  created() {
    this.data = this.generateData()
  },
  methods: {
    show() {
      console.log(this.choseSub)
      // console.log(this.value)
      // console.log(this.value.length)
      // 将获取到的多名学生的各科成绩进行处理
      // 定义一个来存放名字，同时进行异步处理
      const stuName = []
      // 将获取到的多名学生的各科成绩进行处理
      const stuSub = []
      for (let i = 0; i < this.value.length; i++) {
        // 将所选到的学生的id分别传进choseid中方便后面使用
        var choseId = this.value[i]

        this.getStuSemesterData(choseId, i, stuName[i], stuSub[i])
      }

      this.drawMychart()
    },

    async getStuSemesterData(studentId, i, stN, stSub) {
      // console.log(i)

      // 定义学生人文成绩
      const objData = []
      // 定义实践成绩
      const objSj = []
      // 定义科学成绩
      const objKx = []

      // 定义用来存存储周次的数据，在后面setOption出将其传入x轴作为x轴的data
      const weekArr = []

      const res = await getStuSemester({ studentId })
      // 将获取到的学生成绩存储到sessionStorage中
      const sub = res.data.data
      sessionStorage.setItem('classStusub', JSON.stringify(sub))
      // 获取此时的学生姓名，将学生姓名放入stuName中
      stN = sub[0].name

      console.log(stN)
      console.log(sub)
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
        // 将周次传入到weekArr数组中，以便将周次实时同步
        weekArr[j] = ['第' + (j + 1) + '周']
      }

      // 将所遍历的各个学生的人文成绩存到stuSub中
      // 再通过下方异步将stuSub中的数据放入到sessionStorage中
      if (this.choseSub === '人文') {
        stSub = objData
      }
      if (this.choseSub === '实践') {
        stSub = objSj
      }
      if (this.choseSub === '科学') {
        stSub = objKx
      }
      sessionStorage.setItem('stuSubRw', JSON.stringify(stN))
      sessionStorage.setItem('stuName', JSON.stringify(sub))
    },
    generateData() {
      const data = []
      // 将上一个页面所存储起来的该班级学生放置到classStu中，方便后面使用
      const classStu = JSON.parse(sessionStorage.getItem('stu'))
      classStu.map(item => {
        // 将班级的学生姓名、学生ID传到name、id中，再将其放到data中作为data的key以及文本
        data.push({
          key: item.studentId,
          label: item.name
        })
      })
      return data
    },
    drawMychart() {
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
        series: []
      })

      // 将处理好的数据传入表中
      myChart.setOption({
        // 将所选的学生名单传入到echart的legend即选项中，用户可在图像生成后选择学生
        // 选择了哪几个学生就会在图像上方生成这几个学生的选项
        legend: {
          data: JSON.parse(sessionStorage.getItem('stuName'))
        },
        // 最多可选择五位学生，将他们的单科成绩显示在图表上
        series: [
          {
            name: JSON.parse(sessionStorage.getItem('stuName'))[0],
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[0]
          },
          {
            name: JSON.parse(sessionStorage.getItem('stuName'))[1],
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[1]
          },
          {
            name: JSON.parse(sessionStorage.getItem('stuName'))[2],
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[2]
          },
          {
            name: JSON.parse(sessionStorage.getItem('stuName'))[3],
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[3]
          },
          {
            name: JSON.parse(sessionStorage.getItem('stuName'))[4],
            type: 'line',
            areaStyle: {},
            data: JSON.parse(sessionStorage.getItem('stuSubRw'))[4]
          }
        ],
        xAxis: {
          data: this.weekArr
        }
      })
    }
  }
}
</script>
<style lang=""></style>
