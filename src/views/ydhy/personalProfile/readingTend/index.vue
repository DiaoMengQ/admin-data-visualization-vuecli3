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
                @change="getReadHabitLinReg()"
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

        <!-- 选择所想查看的科目 -->
        <el-col :xs="24" :lg="8" :xl="8">
          <el-form>
            <el-form-item label-width="100px" label="科目选择：" class="postInfo-container-item">
              <el-select v-model="book " placeholder="请选择" @change="getReadHabitLinReg()">
                <el-option v-for="bk in bookType" :key="bk.bookTypeId" :label="bk.bookTypeLabel" :value="bk.bookTypeId" />
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
import ecStat from 'echarts-stat'
import 'echarts/theme/macarons'
import { getYDHYSchoolInfo, getYDHYClassInfo, classUserInfo, getuserReadHabitLinReg } from '@/api/ydhy'
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
      // 当前选中的书类型
      book: 'category_kexue',
      // 该学生当前科目历史成绩
      historyScore: {},
      // 该学生该科目的平均成绩
      scrore: '',
      // 科目下拉框
      bookType: [
        { bookTypeId: 'cate', bookTypeLabel: 'cate' },
        { bookTypeId: 'category_kexue', bookTypeLabel: '科学' },
        { bookTypeId: 'category_lishi', bookTypeLabel: '历史' },
        { bookTypeId: 'category_manhua', bookTypeLabel: '漫画' },
        { bookTypeId: 'category_mingren', bookTypeLabel: '名人' },
        { bookTypeId: 'category_mingzhu', bookTypeLabel: '名著' },
        { bookTypeId: 'category_parents', bookTypeLabel: '亲情' },
        { bookTypeId: 'category_shenhua', bookTypeLabel: '神话' },
        { bookTypeId: 'category_shige', bookTypeLabel: '诗歌' },
        { bookTypeId: 'category_shuxue', bookTypeLabel: '数学' },
        { bookTypeId: 'category_teachers', bookTypeLabel: '教育' },
        { bookTypeId: 'category_tonghua', bookTypeLabel: '童话' },
        { bookTypeId: 'category_xiaoshuo', bookTypeLabel: '小说' }
      ],
      // 定义此时所选的科目名，以便可以作为图表标题
      subjectName: ''
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
    // 参考群体画像对数据的处理方式
    wrappedData() {
      const save = []

      // 对单个用户的历史得分进行循环，包装成【周，分】的点
      const historys = JSON.parse(this.historyScore).map((item, index) => {
        return [index + 1, item]
      })
      save.push(...historys)
      return save
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
    getReadHabitLinReg() {
      getuserReadHabitLinReg({ userId: this.stunum, bookType: this.book })
        .then(res => {
          console.log(res.data.data)
          if (res.data.data[0] == null) {
            alert('该科目本学期没有成绩')
          } else {
            this.historyScore = res.data.data[0].historyScore
            this.scrore = res.data.data[0].nearSevInter
            console.log(this.historyScore)
            this.drawLinear()
          }
        })
    },
    // 将获取到的书本id匹配对应的书本名称，以便作为图表标题
    findBookName(val) {
      const bookName = this.bookType.find((item) => {
        if (item.bookTypeId === val) {
          return item.bookTypeLabel
        }
      })
      this.subjectName = bookName.bookTypeLabel
      console.log(bookName.bookTypeLabel)
    },
    drawLinear() {
      this.findBookName(this.book)
      const myRegression = ecStat.regression('linear', this.wrappedData)
      myRegression.points.sort(function(a, b) { return a[0] - b[0] })
      // console.log(this.wrappedData)
      const myChart = echarts.init(this.$refs.chart, 'macarons')
      myChart.clear()
      // 折线图属性设置
      myChart.setOption({
        title: {
          text: '本学期' + this.subjectName + '阅读兴趣趋势',
          subtext: '各个时间' + this.subjectName + '所获得的成绩及成绩k线',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
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
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          symbolSize: 10,
          name: 'scatter',
          type: 'scatter',
          emphasis: {
            label: {
              show: true,
              position: 'left',
              color: 'blue',
              fontSize: 16
            }
          },
          data: this.wrappedData
        },
        {
          name: 'line',
          type: 'line',
          showSymbol: false,
          data: myRegression.points,
          markPoint: {
            itemStyle: {
              color: 'transparent'
            },
            label: {
              show: true,
              position: 'left',
              formatter: myRegression.expression,
              color: '#333',
              fontSize: 14
            },
            data: [{
              coord: myRegression.points[myRegression.points.length - 1]
            }]
          }
        }]
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
