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
        @change="handleListChange"
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
        @selection-change="handleListChange"
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
import { provinceList } from '@/utils/multiple'
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
      provinceList: [],
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
    this.provinceList = provinceList()
    this.fetchAdminInfo()
  },
  methods: {
    // 选择学校后操作
    handleListChange(val) {
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
