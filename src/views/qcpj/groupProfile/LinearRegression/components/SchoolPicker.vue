<template>
  <div>
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
  </div>
</template>

<script>
import { getSchoolInfo } from '@/api/qcpj'
import { getYDHYSchoolInfo } from '@/api/ydhy'

export default {
  name: 'SchoolPicker',
  props: {
    selectedArea: {
      type: Number,
      default: null
    },
    selectedPlatform: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      schoolId: null,
      schoolList: []
    }
  },
  watch: {
    selectedArea: {
      immediate: true,
      handler(val, old) {
        switch (this.$store.state.user['roleType']) {
          case 'SCHOOL_ADMIN':
            break
          default:
            this.schoolId = null
            if (val && val !== old) {
              // 请求七彩评价学校列表
              if (this.selectedPlatform === 'QCPJ') {
                getSchoolInfo({ areaCode: val }).then(response => {
                  this.schoolList = response.data.data
                }).catch(error => {
                  console.log('请求错误 ' + error)
                })
              }
              // 请求阅读海洋学校列表
              if (this.selectedPlatform === 'YDHY') {
                getYDHYSchoolInfo({ areaCode: val }).then(response => {
                  this.schoolList = response.data.data
                }).catch(error => {
                  console.log('请求错误 ' + error)
                })
              }
            }
            break
        }
      }
    }
  },
  methods: {
    // 选择学校后将学校ID传给父组件
    handleSchSelected(val) {
      this.$emit('selected-sch-change', this.schoolId)
    }
  }
}
</script>

<style>

</style>
