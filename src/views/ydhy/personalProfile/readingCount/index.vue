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

        <!-- 年级 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="年级:" class="postInfo-container-item">
              <el-select
                id="Grade"
                v-model="stugrade"
                name="grade"
                clearable
                placeholder="请选择年级"
                style="width:150px"
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
                @change="GetuserReadHabit(stunum)"
              >
                <el-option
                  v-for="(stu,istu) in getClass"
                  :key="istu"
                  :value="stu.userId"
                  :label="stu.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
// import ecStat from 'echarts-stat'
import 'echarts/theme/macarons'
import { getYDHYSchoolInfo, getYDHYClassInfo, classUserInfo, getuserReadHabit } from '@/api/ydhy'
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
      //   科目名称
      bookType: [],
      //   科目成绩
      score: [],
      //   历史成绩
      historyscore: [],
      //   各科成绩
      bookScore: [],
      dataset: []
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
              getYDHYSchoolInfo({ areaCode: this.areaCode }).then(response => {
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
      getYDHYClassInfo({ 'schoolId': this.schoolId, 'endGradeId': item, 'startGradeId': item })
        .then(res => {
          // 将获取到的年级存储到store中
          const grade = res.data.data
          store.commit('setGrade', grade)
          console.log(store.state.Grade)
        })
    },
    // 班级改变，获取该班级的Id,同时获取该班级的学生
    ClassChange(claId) {
      this.stunum = null
      classUserInfo({ 'classId': claId })
        .then(res => {
          const stu = res.data.data
          store.commit('setClass', stu)
          // 传入sessionStorage中方便多选学生时，将学生名单传入多选中
          sessionStorage.setItem('stu', JSON.stringify(stu))
          console.log(store.state.Class)
        })
    },
    GetuserReadHabit(stunum) {
      getuserReadHabit({ userId: stunum })
        .then(res => {
        //   console.log(res.data.data)
          const data = res.data.data
          // console.log(data)
          for (let i = 0; i < data.length; i++) {
            this.bookType[i] = data[i].bookType
            this.score[i] = data[i].score
            this.historyscore[i] = data[i].historyScore.replace([], '')
          }
          console.log(this.historyscore)
          console.log(this.bookType)
          var a = []
          var b = []
          // 获取到横坐标的长度
          for (var n = 0; n < this.historyscore[0].split(',').length; n++) {
            b[n] = JSON.stringify(n + 1)
          }
          b.unshift('product')
          console.log(b)
          // 去掉历史成绩的括号
          for (var j = 0; j < this.historyscore.length; j++) {
            a[j] = this.historyscore[j].replace(/\[|]/g, '')
          }
          console.log(b)

          var d = []
          for (var m = 0; m < a.length; m++) {
            var st = []
            const s = a[m].split(',')
            for (var k = 0; k < s.length; k++) {
              st.push(parseFloat(s[k]))
            }
            d.push(st)
            // console.log(s)
          }
          console.log(d)
          console.log(typeof (this.bookType[1]))
          d.forEach((item, index) => {
            item.unshift(this.mapBookType(this.bookType[index]))
          })
          console.log(d)
          // 将横坐标添加到最前方
          d.unshift(b)
          this.drawMyChart(d)
        })
    },
    mapBookType(a) {
      if (a === 'category_kexue') {
        return '科学'
      }
      if (a === 'category_lishi') {
        return '历史'
      }
      if (a === 'category_manhua') {
        return '漫画'
      }
      if (a === 'category_mingren') {
        return '名人'
      }
      if (a === 'category_mingzhu') {
        return '名著'
      }
      if (a === 'category_parents') {
        return '亲情'
      }
      if (a === 'category_shenhua') {
        return '神话'
      }
      if (a === 'category_shuxue') {
        return '数学'
      }
      if (a === 'category_teachers') {
        return '教育'
      }
      if (a === 'category_tonghua') {
        return '童话'
      }
      if (a === 'category_xiaoshuo') {
        return '小说'
      }
    },
    drawMyChart(c) {
      const myChart = echarts.init(this.$refs.chart, 'macarons')
      myChart.clear()
      myChart.setOption({
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataset: {
          source: c
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{b}: {@1} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '1',
              tooltip: '1'
            }
          }
        ]
      })
      myChart.on('updateAxisPointer', function(event) {
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
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
