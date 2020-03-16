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
              <!-- 按钮 -->
              <el-button plain type="primary" size="small" style="height:40px" @click="initCharts (stunum)">查看评价积分波动</el-button>
            </el-form-item>

          </el-form>
        </el-col>

      </el-row>
      <p v-show="false">
        <el-button plain type="primary" size="small" @click="MoreStudent()">选择多名学生</el-button>
      </p>
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
import { getClassinGrade, getStuinClass, getStuSemester, getSchoolInfo } from '@/api/qcpj'
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
      findweek: '',
      // 获取所选中学生当前有多少周成绩
      maxweek: '7',
      // 获取所选中的学生名字
      nowStuName: '',
      // 点击显示或隐藏多名学生按钮
      ms: false
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
    MoreStudent() {
      window.open('http://localhost:5980/ydhy/moreStudent')
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
          store.commit('setStu', sub)
          console.log(store.state.Stu)
          this.maxweek = sub.length
          this.nowStuName = sub[0].name
          // console.log(sub[0].name)
        })
    },
    // 折线图显示获取到的数据
    initCharts(Stu) {
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
      // 使各周成绩中的选择周次轴隐藏
        this.ms = true
        const myChart = echarts.init(this.$refs.chart, 'macarons')
        // let _this = this
        myChart.clear()
        // 折线图属性设置
        myChart.setOption({
          title: { text: this.nowStuName + '本学期成绩' },
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
            data: ['人文', '实践', '科学']
          },
          series: []
        })
        getStuSemester({ 'studentId': Stu })
          .then(res => {
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
            sessionStorage.setItem('sub', JSON.stringify(sub))

            // 有几周成绩，同时将获取到的字符串转换为obj，没有成绩的赋值为0
            for (var i = 0; i < sub.length; i++) {
              console.log(sub[i].subType)
              /** 人文 */
              // 将获取到的字符串转为obj
              const obj = JSON.parse(sub[i].subType)
              if (obj['人文'] == null) {
                objData[i] = parseInt('0')
              } else {
              // 同时将获取到的每周人文转换为int，方便下方传入到图中data
                objData[i] = parseInt(obj['人文'])
              }
              console.log(obj['人文'])

              /** 实践 */
              if (obj['实践'] == null) {
                objSj[i] = parseInt('0')
              } else {
                // 同时将获取到的每周实践转换为int，方便下方传入到图中data
                objSj[i] = parseInt(obj['实践'])
              }

              /** 科学 */
              if (obj['科学'] == null) {
                objKx[i] = parseInt('0')
              } else {
                // 同时将获取到的每周科学转换为int，方便下方传入到图中data
                objKx[i] = parseInt(obj['科学'])
              }
              // 将周次传入到weekArr数组中，以便将周次实时同步
              weekArr[i] = ['第' + (i + 1) + '周']
            }

            // console.log(weekArr)
            // console.log(objData)

            // 此位置将获取到数据显示到图上
            myChart.setOption({
              series: [
                {
                  name: '人文',
                  type: 'line',
                  areaStyle: {},
                  data: objData
                },
                {
                  name: '实践',
                  type: 'line',
                  areaStyle: {},
                  data: objSj
                },
                {
                  name: '科学',
                  type: 'line',
                  areaStyle: {},
                  data: objKx
                }
              ],
              xAxis: {
                data: weekArr
              }
            })
          })
          .catch(res => {
            console.log('Error：出错了！')
            console.log(res)
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
