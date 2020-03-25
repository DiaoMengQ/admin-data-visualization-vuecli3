<template>
  <div id="app">
    <div id="nav">
      <el-row>
        <!-- 省份 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
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
          </el-form>
        </el-col>

        <!-- 市 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="城市:" class="postInfo-container-item">
              <el-select v-model="areaCode" :disabled="ifCityChangeDisabled" placeholder="请选择">
                <el-option
                  v-for="city in cityList"
                  :key="city.areaCode"
                  :label="city['cityName']"
                  :value="city.areaCode"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 学校 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="学校:" class="postInfo-container-item">
              <el-select v-model="schoolId" placeholder="请选择" @change="GradeChange(stugrade)">
                <el-option
                  v-for="sch in schoolList"
                  :key="sch.schoolId"
                  :label="sch['schoolName']"
                  :value="sch.schoolId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 学生年级 -->
        <!-- GradeChange(stugrade) -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="年级：" class="postInfo-container-item">
              <el-select
                id="Grade"
                v-model="stugrade"
                name="grade"
                clearable
                placeholder="请选择年级"
                @change="GradeChange(stugrade)"
              >
                <el-option
                  v-for="(item,istugrade) in 6"
                  :key="istugrade"
                  :value="item"
                  :label="item+'年级'"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 学生班级 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="班级:" class="postInfo-container-item">
              <el-select
                id="Class"
                v-model="stucla"
                name="class"
                clearable
                placeholder="请选择班级"
                style="width:150px"
                @change="ClassChange (stucla)"
              >
                <el-option
                  v-for="(claId,istucla) in getGrade"
                  :key="istucla"
                  :value="claId.classId"
                  :label="claId.className"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 班级学生人数 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="学生:" class="postInfo-container-item">
              <el-select
                id="Student"
                v-model="stunum"
                name="student"
                clearable
                placeholder="请选择该班级的学生"
                style="width:180px"
                @change="StuChange(stunum)"
              >
                <el-option
                  v-for="(stu,istu) in getClass"
                  :key="istu"
                  :value="stu.studentId"
                  :label="stu.name"
                />
              </el-select>
            </el-form-item>

          </el-form>
        </el-col>

      </el-row>

      <div v-show="sw">
        <span><font>选择周次：</font></span>
        <div>
          <el-slider v-model="findweek" show-input :max="maxweek" :min="1" style="width:60%" @change="StuChange(stunum)" />
        </div>
      </div>
    </div>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:100%;height:600px;margin:0 auto;" />
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import { getUserManaRange } from '@/utils/auth'
import { getAreaInfo } from '@/api/system'
import { provinceList } from '@/utils/multiple'
import store from '@/store/index.js'
import echarts from 'echarts'
import 'echarts/theme/macarons'
import { getClassinGrade, getStuinClass, getStuSemester, getSchoolInfo, getSchoolCoins } from '@/api/qcpj'
export default {
  data() {
    return {
      ifProvinceChangeDisabled: true, // 是否允许切换省份,默认不允许
      ifCityChangeDisabled: true, // 是否允许切换城市,默认不允许
      // 省份
      provinceId: undefined,
      provinceList: [],
      // 城市
      areaCode: null,
      cityList: [],
      // 学校
      schoolId: null,
      schoolList: [],

      // 此时的所有年级
      stugrade: '',
      // 此年级的所有班级
      stucla: '',
      // 该班级的学生人数
      stunum: '',
      // 查询周次
      findweek: 1,
      // 使点击各周按钮时时间轴会显示出来
      sw: false,
      // 点击显示或隐藏多名学生按钮
      ms: false,
      // 获取所选中学生当前有多少周成绩
      maxweek: '',
      // 获取所选中的学生名字
      nowStuName: '',
      weekArr: [],
      nowWeek: [],
      subType: [],
      echartService: []
    }
  },
  computed: {
    // 将获取到该年级的所有班级放在computed中、做计算属性、当vuex的值发生改变会对应改变
    getGrade() {
      return store.state.Grade
    },
    // 将获取到该班级的所有学生
    getClass() {
      return store.state.Class
    },
    // 将获取到的学生ID,获取其每周分数
    getStu() {
      return store.state.Stu
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
  mounted() {
    this.JudgeManaRange()
  },
  created() {
    this.provinceList = provinceList()
  },
  methods: {
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
    },
    // 年级改变，同时获取该年级的所有班级
    GradeChange(item) {
      this.stucla = null
      this.stunum = null
      //   获取班级接口
      getClassinGrade({ 'schoolId': this.schoolId, 'endGradeId': item, 'startGradeId': item })
        .then(res => {
          // 将获取到的年级存储到store中
          const grade = res.data.data
          store.commit('setGrade', grade)
          console.log(store.state.Grade)

          // console.log(store.state.Grade[0].className)
        })

      // 获取学校id的同时获取该学校的素养类型
      var sId = ''
      sId = parseInt(this.schoolId)
      getSchoolCoins(sId)
        .then(res => {
          // console.log(res.data.data)
          const sub = res.data.data
          // 每次获取都将subtype重置以免堆积好几个学校的subtype
          this.subType = []
          this.findweek = 1
          for (var i = 0; i < sub.length; i++) {
            this.subType.push(sub[i].name)
          }
          // console.log(this.subType)
        })
    },
    // 班级改变，获取该班级的Id,同时获取该班级的学生
    ClassChange(claId) {
      this.stunum = null
      getStuinClass({ 'classId': claId })
        .then(res => {
          const stu = res.data.data
          store.commit('setClass', stu)
          // 传入sessionStorage中方便多选学生时，将学生名单传入多选中
          sessionStorage.setItem('stu', JSON.stringify(stu))
          console.log(store.state.Class)
        })
    },
    // 所选学生改变，显示学生的各周次分数
    StuChange(Stu) {
      getStuSemester({ 'studentId': Stu })
        .then(res => {
        // console.log(res.data.data[0].subType)
          const sub = res.data.data
          // console.log(store.state.Stu)
          this.maxweek = parseInt(sub.length)
          this.nowStuName = sub[0].name

          this.nowWeek = []
          // 将周次获取处理为横坐标
          for (var i = 0; i < this.findweek; i++) {
            this.nowWeek.push(i + 1)
          }
          var test = []
          this.echartService = []

          // 处理subtype
          for (var j = 0; j < this.subType.length; j++) {
            var subType = this.subType[j]
            // console.log(typeof (subType)) //string
            test = []
            // 遍历本学期每个科目的成绩
            for (var n = 0; n < this.findweek; n++) {
              const obj = JSON.parse(sub[n].subType)
              if (obj[subType] == null) {
                test[n] = parseInt('0')
              } else {
                test[n] = parseInt(obj[subType])
              }
              // console.log(obj[subType ])
            }
            // 将对应科目的成绩按照echats折线的格式放入series中
            this.echartService[j] = {
              name: subType,
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: test
            }
          }
          this.barCharts(Stu)
          // console.log(sub[0].name)
        })
    },
    // 柱状图获取各周单科成绩
    barCharts(Stu) {
      // 未选择学生弹框提示先选择学生
      if (Stu.length <= 0) {
        this.$alert('请先选择学生', '错误！未选择学生', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      } else {
        // 使各周成绩中的选择周次轴显示
        this.sw = true
        this.ms = false
        const barChart = echarts.init(this.$refs.chart, 'macarons')
        // 清空echarts画布，避免图像重叠显示
        barChart.clear()
        barChart.setOption({
          title: { text: this.nowStuName + '——前' + this.findweek + '周——' + '成绩' },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: this.subType
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category'
          },
          series: []
        })
        // 此位置将获取到数据显示到图上
        barChart.setOption({
          series: this.echartService,
          yAxis: {
            data: this.nowWeek
          }
        })
      }
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;

}
</style>
