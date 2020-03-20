<template>
  <div id="app-content" v-loading="loading">
    <el-form>
      <el-row>
        <!-- 省份 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="省份:" class="postInfo-container-item">
            <el-select v-model="provinceId" :disabled="ifProvinceChangeDisabled" placeholder="请选择">
              <el-option
                v-for="province in provinceList"
                :key="province.provinceId"
                :label="province.provinceName"
                :value="province.provinceId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 市 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="市:" class="postInfo-container-item">
            <el-select v-model="areaCode" :disabled="ifCityChangeDisabled" placeholder="请选择">
              <el-option
                v-for="city in cityList"
                :key="city.areaCode"
                :label="city['cityName']"
                :value="city.areaCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 学校 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="学校:" class="postInfo-container-item">
            <el-select v-model="schoolId" placeholder="请选择" @change="handleSchSelected">
              <el-option
                v-for="sch in schoolList"
                :key="sch.schoolId"
                :label="sch['schoolName']"
                :value="sch.schoolId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 课程 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="课程:" class="postInfo-container-item">
            <el-select v-model="subjectLabel" placeholder="请选择">
              <el-option
                v-for="(subj,index) in subjectList"
                :key="index"
                :label="subj['subjectLabel']"
                :value="subj['subjectLabel']"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 年级 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="年级:" class="postInfo-container-item">
            <el-select v-model="gradeId" clearable placeholder="请选择" @change="handleGradeSelected">
              <el-option
                v-for="grade in gradeList"
                :key="grade.gradeId"
                :label="grade['gradeName']"
                :value="grade.gradeId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 班级 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="班级:" class="postInfo-container-item">
            <el-select v-model="classId" clearable placeholder="请选择">
              <el-option
                v-for="cla in classList"
                :key="cla.classId"
                :label="cla['className']"
                :value="cla.classId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 学期范围 -->
        <el-col :xs="24" :sm="12" :lg="8" :xl="8">
          <el-form-item label-width="100px" label="学期范围:" class="postInfo-container-item">
            <el-select v-model="weekRange" placeholder="请选择">
              <el-option
                v-for="week in weekList"
                :key="week.weekId"
                :label="week.weekLabel"
                :value="week.weekId"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <!-- 斜率范围 -->
      <el-row>
        <el-col :sm="20" :md="20" :lg="12" :xl="8">
          <el-form-item label-width="100px" label="系数范围:" class="postInfo-container-item">
            <el-slider
              v-model="coef"
              range
              show-stops
              :min="coefRange[0]"
              :max="coefRange[1]"
              :step="coefStep"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 数据相关度 -->
      <el-row>
        <el-col :sm="20" :md="20" :lg="12" :xl="8">
          <el-form-item label-width="100px" label="数据相关度:" class="postInfo-container-item">
            <el-slider
              v-model="modelScore"
              show-stops
              :max="1"
              :step="modelScoreStep"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="admin-info-post-controler" type="flex" justify="end">
        <el-button type="primary" @click="getQcpjEvaStat">查询</el-button>
      </el-row>
    </el-form>

    <div v-if="ifShowChart" id="chart-main" ref="chart" style="width:800px;height:600px;margin:0 auto;" />

  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { MessageBox } from 'element-ui'
import { provinceList, gradeList } from '@/utils/multiple'
import { getSchoolInfo, getClassinGrade, getSchoolSubjects, schoolSubLinearRegress, classSubLinearRegress } from '@/api/qcpj'
import { getAreaInfo } from '@/api/system'
import { getUserManaRange } from '@/utils/auth'

import echarts from 'echarts'
import 'echarts/theme/macarons'
// 引入提示框和标题组件
require('echarts/lib/component/title')
import ecStat from 'echarts-stat'

export default {
  data() {
    return {
      chartData: [
        [0.952523, 4.636427],
        [0.307047, 3.557078],
        [0.277261, 3.552874],
        [0.279101, 3.494159],
        [0.175724, 3.206828],
        [0.156383, 3.195266],
        [0.733165, 4.221292],
        [0.848142, 4.413372],
        [0.771184, 4.184347],
        [0.429492, 3.742878],
        [0.162176, 3.201878],
        [0.917064, 4.648964],
        [0.315044, 3.510117],
        [0.201473, 3.274434],
        [0.297038, 3.579622],
        [0.336647, 3.489244],
        [0.666109, 4.237386],
        [0.583888, 3.913749],
        [0.085031, 3.22899],
        [0.687006, 4.286286],
        [0.949655, 4.628614],
        [0.189912, 3.239536],
        [0.844027, 4.457997],
        [0.333288, 3.513384],
        [0.427035, 3.729674],
        [0.466369, 3.834274],
        [0.550659, 3.811155],
        [0.278213, 3.598316],
        [0.918769, 4.692514],
        [0.886555, 4.604859],
        [0.569488, 3.864912],
        [0.066379, 3.184236],
        [0.41732, 3.699876],
        [0.920461, 4.613614],
        [0.106352, 3.154768],
        [0.917886, 4.623637],
        [0.014855, 3.078132],
        [0.567682, 3.913596],
        [0.068854, 3.221817],
        [0.603535, 3.938071],
        [0.53205, 3.880822],
        [0.651362, 4.176436],
        [0.901225, 4.648161],
        [0.204337, 3.332312],
        [0.696081, 4.240614],
        [0.963924, 4.532224],
        [0.98139, 4.557105],
        [0.987911, 4.610072],
        [0.990947, 4.636569],
        [0.736021, 4.229813],
        [0.253574, 3.50086],
        [0.674722, 4.245514],
        [0.939368, 4.605182],
        [0.235419, 3.45434],
        [0.110521, 3.180775],
        [0.218023, 3.38082],
        [0.869778, 4.56502],
        [0.19683, 3.279973],
        [0.958178, 4.554241]
      ],
      option: {
        title: {
          text: '群体线性回归分析',
          left: 'center'
        },
        xAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 1.5,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          name: 'scatter',
          type: 'scatter',
          emphasis: {
            label: {
              show: true,
              position: 'left',
              color: ' #0071e6',
              fontSize: 16
            }
          },
          //   data: chartData
          data: null
        }, {
          name: 'line',
          type: 'line',
          showSymbol: false,
          //   data: myRegression.points,
          data: null,
          markPoint: {
            itemStyle: {
              color: 'transparent'
            },
            label: {
              show: true,
              position: 'left',
              //   formatter: myRegression.expression,
              formatter: null,
              color: '#333',
              fontSize: 14
            },
            data: [{
            //   coord: myRegression.points[myRegression.points.length - 1]
              coord: null
            }]
          }
        }]
      },
      ifShowChart: true, // 是否显示图表

      modelScore: 0.5,
      modelScoreStep: 0.1,
      coef: [-180, 180],
      coefRange: [-180, 180],
      coefStep: 10,

      loading: false,

      ifProvinceChangeDisabled: true, // 是否允许切换省份,默认不允许
      ifCityChangeDisabled: true, // 是否允许切换城市,默认不允许

      provinceId: undefined,
      provinceList: [],

      areaCode: null,
      cityList: [],

      schoolId: null,
      schoolList: [],

      classId: null,
      classList: [],

      gradeId: null,
      gradeList: [],

      subjectLabel: null,
      subjectList: [],

      weekRange: '1-18',
      weekList: [
        { weekId: '1-9', weekLabel: '上半学期' },
        { weekId: '10-18', weekLabel: '下半学期' },
        { weekId: '1-18', weekLabel: '全学年' }
      ]

    }
  },
  watch: {
    // 所选省改变
    provinceId: {
      immediate: true,
      handler(val, old) {
        switch (this.$store.state.user['roleType']) {
          case 'SUPER_ADMIN':
            if (this.provinceId && this.provinceId !== old) {
              this.schoolList = [] // 学校列表复位

              getAreaInfo({ province_id: this.provinceId }).then(response => {
                this.cityList = response.data['data']
              })
            }
            this.areaCode = null
            break
          case 'CITY_ADMIN':
            break
          case 'SCHOOL_ADMIN':
            break
          default:
            break
        }
      }
    },
    // 所选市改变
    areaCode: {
      immediate: true,
      handler(val, old) {
        switch (this.$store.state.user['roleType']) {
          case 'SCHOOL_ADMIN':
            break
          default:
            this.schoolId = null
            if (this.areaCode && this.areaCode !== old) {
              getSchoolInfo({ areaCode: this.areaCode }).then(response => {
                this.schoolList = response.data.data
              }).catch(error => {
                console.log('请求错误 ' + error)
              })
            }
            break
        }
      }
    }
  },
  created() {
    this.provinceList = provinceList()
    this.gradeList = gradeList()
    const id = this.$store.state.user['userid']
    this.fetchData(id)
  },
  mounted() {
    this.JudgeManaRange()
    this.drawChart()
  },
  methods: {
    // 绘制图形
    drawChart() {
      this.ifShowChart = true
      // 基于准备好的dom，初始化echarts实例
      var clusterChart = echarts.init(document.getElementById('chart-main'), 'macarons')

      this.chartOptionAssignment()

      // 绘制图表
      if (this.option && typeof this.option === 'object') {
        clusterChart.setOption(this.option, true)
      }
    },
    // chart配置项处理
    chartOptionAssignment() {
      // See https://github.com/ecomfe/echarts-stat
      const myRegression = ecStat.regression('linear', this.chartData)
      myRegression.points.sort(function(a, b) {
        return a[0] - b[0]
      })

      this.option.series[0].data = this.chartData

      this.option.series[1].data = myRegression.points
      this.option.series[1].markPoint.label.formatter = myRegression.expression
      this.option.series[1].markPoint.data[0].coord = myRegression.points[myRegression.points.length - 1]
    },

    // 获取QCPJ学校科目线性回归相关数据
    getQcpjEvaStat() {
      const para = {
        schoolId: this.schoolId,
        gradeId: this.gradeId,
        startCoef: this.coef[0], // 系数范围
        endCoef: this.coef[1], // 系数范围
        modelScore: this.modelScore, // 线性回归模型的拟合度得分
        subject: this.subjectLabel, // 科目
        weekRange: this.weekRange // 可选周数: 1-9/9-18/1-18
      }

      // const para = {
      //   schoolId: 1100002,
      //   gradeId: 4,
      //   startCoef: this.coef[0], // 系数范围
      //   endCoef: this.coef[1], // 系数范围
      //   modelScore: this.modelScore, // 线性回归模型的拟合度得分
      //   subject: '数学', // 科目
      //   weekRange: this.weekRange // 可选周数: 1-9/9-18/1-18
      // }
      //   console.log('线性回归请求参数', para)

      if (this.classId === null) {
        schoolSubLinearRegress(para).then((result) => {
        // console.log('线性回归返回数据', result.data.data)
          this.dataProcess(result.data.data)
          this.drawChart()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        para.classId = this.classId
        classSubLinearRegress(para).then((result) => {
          // console.log('线性回归返回数据', result.data.data)
          this.dataProcess(result.data.data)
          this.drawChart()
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    // 数据处理
    dataProcess(data) {
      const scoreList = []
      for (let i = 0; i < data.length; i++) {
        const score = JSON.parse(data[i].score)
        for (let j = 0; j < score.length; j++) {
          if (score[j].score !== 0) { scoreList.push([score[j].week, score[j].score]) }
        }
      }
      this.chartData = scoreList
    },

    // 选择学校后重置年级ID
    handleSchSelected() {
      this.gradeId = null
      this.classId = null
      const subjectList = []
      getSchoolSubjects(this.schoolId).then((result) => {
        const subjects = result.data.data.subjects
        JSON.parse(subjects, function(k, v) {
          if (k) { subjectList.push({ subjectLabel: k }) }
        })
        // console.log(subjectList)
        this.subjectList = subjectList
      }).catch((err) => {
        console.log(err)
      })
    },

    // 选择年级后请求班级列表
    handleGradeSelected() {
      getClassinGrade({ schoolId: this.schoolId, startGradeId: this.gradeId, endGradeId: this.gradeId }).then((result) => {
        this.classList = result.data.data
        // console.log('班级列表', this.classList)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取管理员信息数据
    fetchData(id) {
      getUserInfo({ userId: id })
        .then(response => {
          this.adminInfo = response.data.data
        //   console.log('用户信息', this.adminInfo)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 用户权限判断
    JudgeManaRange() {
      const manaRange = getUserManaRange(this.$store.state.user['roleType'])
      // console.log(manaRange)
      switch (this.$store.state.user['roleType']) {
        case 'SUPER_ADMIN':
          this.ifProvinceChangeDisabled = false
          this.ifCityChangeDisabled = false
          break
        case 'CITY_ADMIN':
          this.ifProvinceChangeDisabled = true
          this.ifCityChangeDisabled = false

          this.provinceList = []
          this.cityList = []
          if (manaRange !== null && manaRange.length > 0) {
          // 将当前账户权限省份加入备选列表
            this.provinceList.push({ provinceId: manaRange[0].provinceId, provinceName: manaRange[0].provinceName })
            this.provinceId = manaRange[0].provinceId
            // 将当前账户权限城市加入备选列表
            for (let i = 0; i < manaRange.length; i++) {
              this.cityList.push(manaRange[i])
              this.areaCode = manaRange[i].areaCode
            }
          } else {
            MessageBox.confirm('抱歉,您当前没有被授予权限,请联系您的上级管理员进行授权', '错误', {
              confirmButtonText: '确定',
              type: 'error'
            }).then(() => {
              this.$router.push('/home')
            }).catch(() => {
              this.$router.push('/home')
            })
          }
          break
        case 'SCHOOL_ADMIN':
          this.ifProvinceChangeDisabled = true
          this.ifCityChangeDisabled = true

          this.provinceList = []
          this.cityList = []
          getAreaInfo({ province_id: manaRange[0].provinceId, city_id: manaRange[0].cityid }).then((result) => {
            const areaInfo = result.data.data[0]
            if (areaInfo) {
              const provinceItem = { provinceId: areaInfo.provinceId, provinceName: areaInfo.provinceName }
              this.provinceList.push(provinceItem)
              this.provinceId = areaInfo.provinceId

              this.cityList.push(areaInfo)
              this.areaCode = areaInfo.areaCode
            }
          }).catch((err) => {
            console.log(err)
          })

          this.schoolList = manaRange
          break
        default:
          break
      }
    }
  }
}
</script>

<style>
#app-content{margin: 1.8em}
</style>
