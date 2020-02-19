<!--
* 七彩评价页管理项模板
-->
<template>
  <div class="app-container">
    <el-tag>{{ alertInfo }}</el-tag>

    <el-row>
      <el-col :xs="24" :lg="12" :xl="8">省份:
        <!-- TODO: 校级管理员|选中按键后发送网络请求，获取班级信息 -->
        <!-- TODO: 省份下拉框，获取下拉框的值并进行数据请求 -->
        <el-select v-model="provinceId" placeholder="请选择">
          <el-option
            v-for="province in provinceList"
            :key="province.provinceId"
            :label="province.provinceName"
            :value="province.provinceId"
          />
        </el-select>
      </el-col>

      <el-col v-if="ifShowCityList" :xs="24" :lg="12" :xl="8">市:
        <el-select v-model="areaCode" placeholder="请选择">
          <el-option
            v-for="city in cityList"
            :key="city.areaCode"
            :label="city['cityName']"
            :value="city.areaCode"
          />
        </el-select>
      </el-col>
    </el-row>

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
          <router-link :to="'/qcpj/clusterAnalysis/schoolSearch/'+scope.row['schoolId']" class="link-type">
            <span @click="saveSchoolInfo(scope.row['schoolId'],scope.row['schoolName'])">{{ scope.row['schoolName'] }}</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- span 设定每个循环样式中的空白 -->
    <!-- <el-col v-for="(value, key) in schoolList" :key="key" :span="8"> -->

    <!-- <el-col
      v-for="(school, schoolListkey) in schoolList"
      :key="schoolListkey"
      :span="8"
    >
      <div style="padding: 0px;">
        <span>{{ school["schoolName"] }}</span>
      </div>
    </el-col>
    -->

  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { str2obj } from '@/utils/multiple'
import { setSchoolVal } from '@/utils/school'
import { getAreaInfo, getSchoolInfo } from '@/api/qcpj'

export default {
  data() {
    return {
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
        // { provinceId: 11, provinceName: '北京' },
        // { provinceId: 12, provinceName: '天津' },
        // { provinceId: 13, provinceName: '河北' },
        // { provinceId: 14, provinceName: '山西' },
        // { provinceId: 15, provinceName: '内蒙古' },
        // { provinceId: 21, provinceName: '辽宁' },
        // { provinceId: 22, provinceName: '吉林' },
        // { provinceId: 23, provinceName: '黑龙江' },
        // { provinceId: 31, provinceName: '上海' },
        // { provinceId: 32, provinceName: '江苏' },

        // { provinceId: 33, provinceName: '浙江' },
        // { provinceId: 34, provinceName: '安徽' },
        // { provinceId: 35, provinceName: '福建' },
        // { provinceId: 36, provinceName: '江西' },
        // { provinceId: 37, provinceName: '山东' },
        // { provinceId: 41, provinceName: '河南' },
        // { provinceId: 42, provinceName: '湖北' },
        // { provinceId: 43, provinceName: '湖南' },
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
        { provinceId: 65, provinceName: '新疆' }
      ],
      areaCode: null,
      cityList: [],
      schoolId: undefined,
      schoolList: []
    }
  },
  // 计算属性
  computed: {
    alertInfo: function() {
      // TODO: 判断用户角色及权限范围并显示对应界面
      const roleType = this.$store.state.user['roleType']
      if (roleType !== null || roleType !== '') {
        return roleType
      } else {
        return '无权限'
      }
    }
  },
  // 监视方法(或用@change属性代替)
  watch: {
    // 所选省改变
    provinceId: {
      immediate: true,
      handler(val, old) {
        // console.log('值已改变')
        // console.log('新选中值: ', val, '旧值: ', old)
        // console.log('省ID: ', this.provinceId)
        if (this.provinceId && this.provinceId !== old) {
          this.ifShowCityList = true // 城市选项复位
          this.schoolList = [] // 学校列表复位
          this.ifShowSchoolList = false // 隐藏学校列表

          getAreaInfo({ province_id: this.provinceId }).then(response => {
            this.cityList = response.data['data']
          })
        }
        this.areaCode = null
      }
    },
    // 所选市改变
    areaCode: {
      immediate: true,
      handler(val, old) {
        // console.log('市ID: ', this.areaCode)
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
      }
    }
  },
  mounted() {
    // if (getUserID()) {
    //   // this.$message({
    //   //   message: 'userId: ' + getUserID(),type: 'info',duration: 3 * 1000})
    //   // 调用action方法，通常是异步操作
    //   this.$store.dispatch('user/getUserManaRange').then(() => {
    //     var schoolarr = getUserManaRange() // from cookie
    //     if (schoolarr) {
    //       schoolarr = schoolarr.replace('},{', '}|{')
    //       schoolarr = schoolarr.replace('[{', '{')
    //       schoolarr = schoolarr.replace('}]', '}')
    //       schoolarr = schoolarr.split('|')
    //       // 若使用foreach，调用方法后是不会改变原数组的值
    //       // schoolarr.forEach(element => { str2obj(element) })
    //       // 故使用map迭代器对每一个元素调用方法
    //       schoolarr = schoolarr.map(str2obj)
    //       // console.log('index.vue: ', schoolarr[0])
    //       this.schoolList = schoolarr
    //     }
    //     console.log(this.alertInfo)
    //   })
    // }
  },
  methods: {
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
