<template>
  <div>
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

  </div>

</template>

<script>
import { MessageBox } from 'element-ui'
import { provinceList } from '@/utils/multiple'

import { getAreaInfo } from '@/api/system'
import { getUserManaRange } from '@/utils/auth'

export default {
  name: 'AuthJudge',
  data() {
    return {
      loading: false,

      ifProvinceChangeDisabled: true, // 是否允许切换省份,默认不允许
      ifCityChangeDisabled: true, // 是否允许切换城市,默认不允许

      provinceId: undefined,
      provinceList: [],

      areaCode: null,
      cityList: []
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
        this.$emit('selected-area-change', val)
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
    }
  }
}
</script>

<style>
</style>
