
<template>
  <div class="app-container">
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
      </el-row>
    </el-form>

    <!-- 学校列表 -->
    <el-table v-if="ifShowSchoolList" v-loading="listLoading" :data="schoolList" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="学校ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row['schoolId'] }}</span>
        </template>
      </el-table-column>

      <!-- 点击文本跳转编辑 -->
      <el-table-column min-width="300px" label="学校名称">
        <template slot-scope="scope">
          <router-link :to="'/qcpj/clusterAnalysis/createTask/info/'+scope.row['schoolId']" class="link-type">
            <span @click="saveSchoolInfo(scope.row['schoolId'],scope.row['schoolName'])">{{ scope.row['schoolName'] }}</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { str2obj } from '@/utils/multiple'
import { setSchoolVal } from '@/utils/school'
import { getSchoolInfo } from '@/api/qcpj'
import { getAreaInfo } from '@/api/system'
import { getUserManaRange } from '@/utils/auth'
import { MessageBox } from 'element-ui'

export default {
  data() {
    return {
      ifProvinceChangeDisabled: true, // 是否允许切换省份,默认不允许
      ifCityChangeDisabled: true, // 是否允许切换城市,默认不允许
      ifShowCityList: false, // 是否显示城市列表
      ifShowSchoolList: false, // 是否显示学校列表
      listLoading: false, // 是否正在加载学校列表

      // 测试值
      storeLocation: '初始值',
      changeStoreVisible: false,
      beforeStorageValue: '',
      afterStorageValue: '',

      currentDate: new Date(), // 当前时间

      provinceId: undefined,
      provinceList: [
        { provinceId: 44, provinceName: '广东' },
        { provinceId: 45, provinceName: '广西' },
        { provinceId: 46, provinceName: '海南' },

        { provinceId: 50, provinceName: '重庆' },
        { provinceId: 51, provinceName: '四川' },
        { provinceId: 52, provinceName: '贵州' },
        { provinceId: 53, provinceName: '云南' },
        { provinceId: 54, provinceName: '西藏' },
        { provinceId: 61, provinceName: '陕西' },
        { provinceId: 62, provinceName: '甘肃' },
        { provinceId: 63, provinceName: '青海' },
        { provinceId: 64, provinceName: '宁夏' },
        { provinceId: 65, provinceName: '新疆' },
        { provinceId: 11, provinceName: '北京' },
        { provinceId: 12, provinceName: '天津' },
        { provinceId: 13, provinceName: '河北' },
        { provinceId: 14, provinceName: '山西' },
        { provinceId: 15, provinceName: '内蒙古' },
        { provinceId: 21, provinceName: '辽宁' },
        { provinceId: 22, provinceName: '吉林' },
        { provinceId: 23, provinceName: '黑龙江' },
        { provinceId: 31, provinceName: '上海' },
        { provinceId: 32, provinceName: '江苏' },

        { provinceId: 33, provinceName: '浙江' },
        { provinceId: 34, provinceName: '安徽' },
        { provinceId: 35, provinceName: '福建' },
        { provinceId: 36, provinceName: '江西' },
        { provinceId: 37, provinceName: '山东' },
        { provinceId: 41, provinceName: '河南' },
        { provinceId: 42, provinceName: '湖北' },
        { provinceId: 43, provinceName: '湖南' }
      ],
      areaCode: null,
      cityList: [],
      schoolId: undefined,
      schoolList: []
    }
  },
  // 监视方法(或用@change属性代替)
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
                console.log(this.cityList)
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
          this.ifShowCityList = true
          this.ifCityChangeDisabled = false
          this.ifShowSchoolList = false

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
          this.ifShowCityList = true
          this.ifCityChangeDisabled = true
          this.ifShowSchoolList = true

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
    // 弹框取消改变
    changeStoreCancle() {
      this.storeLocation = this.beforeStorageValue
      this.changeStoreVisible = false
    },
    // 弹框确认改变
    changeStoreForm() {
      this.changeStoreVisible = false
    },
    // 取消弹框
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    saveSchoolInfo(id, name) {
      setSchoolVal({ schoolId: id, schoolName: name })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin: 20px;
}

.el-col{
  margin: 10px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
