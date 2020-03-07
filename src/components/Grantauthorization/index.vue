<template>
  <el-row v-loading="loading">
    <el-col v-if="ifShowProvinceList" :xs="24" :lg="12" :xl="8">
      <el-form-item prop="provinceId" label-width="100px" label="省份:" class="postInfo-container-item">
        <el-select v-model="provinceId" placeholder="请选择省份">
          <el-option
            v-for="province in provinceList"
            :key="province.provinceId"
            :label="province.provinceName"
            :value="province.provinceId"
          />
        </el-select>
      </el-form-item>
    </el-col>

    <!-- 城市选择器 -->
    <el-col v-if="ifShowCityList" :xs="24" :lg="12" :xl="8">
      <el-form-item prop="areaCode" label-width="100px" label="市:" class="postInfo-container-item">
        <el-select v-model="areaCode" placeholder="请选择">
          <el-option
            v-for="city in cityList"
            :key="city.areaCode"
            :label="city['cityName']"
            :value="city.areaCode"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <!-- 城市多选项 -->
    <el-col v-if="ifShowCityTransfer" :xs="24">
      <el-transfer
        v-model="areaSelectedList"
        :data="cityList"
        :props="{
          key: 'areaCode',
          label: 'cityName'
        }"
        :titles="['可选城市', '已选城市']"
      />
    </el-col>

    <!-- 学校列表 -->
    <el-col :xs="20" :lg="20" :xl="20" style="margin:10px 0">
      <!-- 学校列表 -->
      <el-table
        v-if="ifShowSchoolList"
        v-loading="listLoading"
        max-height="350"
        :data="schoolList"
        border
        fit
        highlight-current-row
        @selection-change="handleSchChange"
      >
        <el-table-column
          type="selection"
          width="35px"
        />

        <el-table-column min-width="300px" label="学校列表">
          <template slot-scope="scope">
            <span>{{ scope.row['schoolName'] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="学校ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row['schoolId'] }}</span>
          </template>
        </el-table-column>

      </el-table>

    </el-col>
  </el-row>
</template>

<script>
import { getAreaInfo, getAllSchoolInfo } from '@/api/system'

import { MessageBox } from 'element-ui'
export default {
  name: 'GrantAuth',
  props: {
    adminInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,

      roleTypeOptions: [],

      ifShowProvinceList: false, // 是否显示省份列表,默认不显示
      ifShowCityList: false, // 是否显示城市列表,默认不显示
      ifShowCityTransfer: false, // 是否显示城市穿梭框,默认不显示
      ifShowSchoolList: false, // 是否显示学校列表,默认不显示
      listLoading: false, // 是否正在加载学校列表

      provinceId: '',
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
      areaSelectedList: [],
      cityList: [],
      schoolId: undefined,
      schoolList: [],
      schSelectedList: []

    }
  },
  watch: {
    // 省份变化
    provinceId: {
      immediate: true,
      handler(val, old) {
        switch (this.$store.state.user['roleType']) {
          case 'SCHOOL_ADMIN':
            MessageBox.confirm('抱歉,您没有创建新账户的权限', '失败', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.$router.push('/home')
            }).catch(() => {
              this.$router.push('/home')
            })
            break
          default:
            if (this.provinceId && this.provinceId !== old) {
              this.schoolList = []
              this.ifShowSchoolList = false // 隐藏学校列表
              this.areaCode = null
              this.areaSelectedList = []

              switch (this.adminInfo.roleType) {
                case 'SCHOOL_ADMIN':
                  this.ifShowCityTransfer = false
                  this.ifShowCityList = true
                  break
                case 'CITY_ADMIN':
                  this.ifShowCityTransfer = true
                  this.ifShowCityList = false
                  break
                default:
                  break
              }
              getAreaInfo({ province_id: this.provinceId }).then(response => {
                this.cityList = response.data['data']
              })
            }

            break
        }
      }
    },
    // 所选市改变
    areaCode: {
      immediate: true,
      handler(val, old) {
        // 判断自身的角色类型
        switch (this.$store.state.user['roleType']) {
          case 'SUPER_ADMIN':
            // 判断所创建的角色类型
            switch (this.adminInfo.roleType) {
              // 创建校级管理员
              case 'SCHOOL_ADMIN':
                if (this.areaCode && this.areaCode !== old) {
                  this.ifShowSchoolList = true
                  this.listLoading = true
                  getAllSchoolInfo({ areaCode: this.areaCode }).then(response => {
                    this.schoolList = response.data.data
                    this.listLoading = false
                  }).catch(error => {
                    console.log('学校列表请求错误 ' + error)
                  })
                }
                break
              // 创建市级管理员
              case 'CITY_ADMIN':
                console.log(this.areaCode)
                break
              default:
                break
            }
            break
          case 'CITY_ADMIN':
            if (this.areaCode && this.areaCode !== old) {
              this.ifShowSchoolList = true
              this.listLoading = true
              getAllSchoolInfo({ areaCode: this.areaCode }).then(response => {
                this.schoolList = response.data.data
                this.listLoading = false
              }).catch(error => {
                console.log('学校列表请求错误 ' + error)
              })
            }
            break
          default:
            console.log('跳出')
            break
        }
      }
    }
  },
  created() {
    this.fetchAdminInfo()
  },
  methods: {
    // 选择学校后操作
    handleSchChange(val) {
      this.schSelectedList = val
      this.$emit('selected-list', val)
    },
    // 获取父组件传入的 adminInfo
    fetchAdminInfo() {
    //   console.log(this.adminInfo)
      this.roleTypeChanged(this.adminInfo.roleType)
    },
    // 获取账户角色类型后设定信息
    roleTypeChanged(val) {
      this.$forceUpdate()
      this.ifShowCityTransfer = false
      this.ifShowCityList = false
      switch (val) {
        case 'CITY_ADMIN':
          this.adminInfo.roleTypeLabel = '市级管理员'
          this.ifShowProvinceList = true
          this.provinceId = null
          this.ifShowSchoolList = false
          break
        case 'SCHOOL_ADMIN':
          this.adminInfo.roleTypeLabel = '校级管理员'
          this.ifShowProvinceList = true
          this.provinceId = null
          this.ifShowSchoolList = false
          break
        default:
          break
      }
    }

  }
}
</script>

<style>
</style>
