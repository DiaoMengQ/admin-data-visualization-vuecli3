<template>
  <div id="app">
    <el-form>
      <el-row>
        <el-col :xs="24" :lg="12" :xl="8">
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
        <el-col v-if="ifShowCityList" :xs="24" :lg="12" :xl="8">
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
        <el-col v-if="ifShowSchoolList" :xs="24" :lg="12" :xl="8">
          <el-form-item label-width="100px" label="学校:" class="postInfo-container-item">
            <el-select v-model="schoolId" placeholder="请选择">
              <el-option
                v-for="(school,index) in schoolList"
                :key="index"
                :label="school['schoolName']"
                :value="school.schoolId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="nav">
      <class-picker v-model="classId" :school-id="schoolId" class="class-picker" @update="getData" />
      <el-input-number
        v-model="week"
        class="week-picker"
        :min="1"
        :max="14"
        label="周数"
        @change="getData"
      />
    </div>
    <!-- 显示可视化图表 -->
    <div ref="chart" style="width:90%;height:90%;margin:0 auto;min-height:500px;min-width:800px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import ClassPicker from '@/components/class/ClassPicker'
import { getClassTeaEvaAvg } from '@/api/qcpj'
import { provinceList } from '@/utils/multiple'
import { getSchoolInfo } from '@/api/qcpj'
import { getAreaInfo } from '@/api/system'
import { getUserManaRange } from '@/utils/auth'
import { MessageBox } from 'element-ui'
export default {
  name: 'TeaEvaAvgRadarChart',
  components: { ClassPicker },
  data() {
    return {
      ifProvinceChangeDisabled: true, // 是否允许切换省份,默认不允许
      ifCityChangeDisabled: true, // 是否允许切换城市,默认不允许
      ifShowCityList: false, // 是否显示城市列表
      ifShowSchoolList: false, // 是否显示学校列表
      listLoading: false, // 是否正在加载学校列表
      provinceId: undefined,
      provinceList: [],
      areaCode: null,
      cityList: [],
      schoolId: undefined,
      schoolList: [],
      classId: '', // 当前班级Id,
      week: 1, // 周数
      data: {} // 数据
    }
  },
  computed: {
    labels() {
      return Object.keys(this.data)
    },
    values() {
      return Object.values(this.data).map(num => num.toFixed(0))
    },
    shadows() {
      return new Array(this.data.length).fill(500)
    }
  },
  watch: {
    // 所选省改变
    provinceId: {
      immediate: true,
      handler(val, old) {
        switch (this.$store.state.user['roleType']) {
          case 'SUPER_ADMIN':
            // console.log('值已改变')
            // console.log('新选中值: ', val, '旧值: ', old)
            // console.log('省ID: ', this.provinceId)
            if (this.provinceId && this.provinceId !== old) {
              this.ifShowCityList = true // 城市选项复位
              this.schoolList = [] // 学校列表复位
              this.ifShowSchoolList = false // 隐藏学校列表

              getAreaInfo({ province_id: this.provinceId }).then(response => {
                this.cityList = response.data['data']
                // console.log(this.cityList)
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
            if (this.areaCode && this.areaCode !== old) {
              this.ifShowSchoolList = true
              this.listLoading = true
              getSchoolInfo({ areaCode: this.areaCode }).then(response => {
                // console.log(response.data.data)
                this.schoolList = response.data.data
                this.listLoading = false
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
  },
  mounted() {
    this.JudgeManaRange()
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
    getData() {
      const self = this
      getClassTeaEvaAvg({
        classId: this.classId,
        week: this.week
      }).then(res => {
        self.data = JSON.parse(res.data.data.score)
        self.makeRadarChart()
      })
    },
    makeRadarChart() {
      const radarChart = echarts.init(this.$refs.chart)
      // 清空echarts画布，避免图像重叠显示
      radarChart.clear()
      radarChart.setOption({
        title: {
          text: '基础雷达图'
        },
        radar: {
          //   shape: "circle",
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#2378f7',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: this.labels.map(label => {
            return {
              name: label
            //   max: 100
            }
          })
        },
        series: [
          {
            name: '当周该班的积分情况',
            type: 'radar',
            areaStyle: {
              normal: {
                opacity: 0.9,
                color: new echarts.graphic.RadialGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            data: [
              {
                value: this.values,
                name: '积分情况',
                symbolSize: 1,
                lineStyle: {
                  normal: {
                    color: '#2378f7'
                  }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#83bff6' },
                      { offset: 0.5, color: '#188df0' },
                      { offset: 1, color: '#188df0' }
                    ])
                  },
                  emphasis: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#2378f7' },
                      { offset: 0.7, color: '#2378f7' },
                      { offset: 1, color: '#83bff6' }
                    ])
                  }
                }
              }
            ]
          }
        ]
      })
    }
  }
}
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
