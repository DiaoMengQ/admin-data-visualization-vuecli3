<!--
* 七彩评价页管理项模板
-->
<template>
  <div class="app-container">
    <el-tag>{{ alertInfo }}</el-tag>

    <el-row>
      <!-- TODO: 校级管理员|选中按键后发送网络请求，获取班级信息 -->
      <!-- TODO: 设定下拉框，获取下拉框的值并进行数据请求 -->

      <!-- span 设定每个循环样式中的空白 -->
      <!-- <el-col v-for="(value, key) in schoolList" :key="key" :span="8"> -->
      <el-col
        v-for="(school, schoolListkey) in schoolList"
        :key="schoolListkey"
        :span="8"
      >
        <el-button
          :body-style="{ padding: '0px' }"
          @click="getClassInfo(school)"
        >
          <div style="padding: 0px;">
            <span>{{ school["schoolName"] }}</span>
          </div>
        </el-button>
      </el-col>
    </el-row>

    <!-- <el-tabs type="border-card">
      <el-tab-pane
        v-for="(value, key) in schoolList"
        :key="key"
        :label="value['schoolName']"
      >
        <li>
          <span>{{ key }}</span>
          <span>{{ value["schoolId"] }}</span>
          <span>{{ value["schoolName"] }}</span>
        </li>
      </el-tab-pane>
    </el-tabs> -->
    <el-col v-if="showStartGrade">
      <el-select v-model="storeLocation" placeholder="请选择年级范围">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
      <span> - </span>
      <el-select v-model="endGreade" placeholder="至年级">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
    </el-col>

    <el-dialog
      :visible.sync="changeStoreVisible"
      class="taskDialog delete-shortcut-dialog"
      width="420px"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <span style="font-size:16px;font-weight:400;">
        <i
          class="iconfont icon-warning"
          style="font-size:20px;color:rgba(23,155,255,1);margin-right:5px;"
        />是否改变选项值
      </span>
      <p class="tips-text" style="height: 38px;">
        <span style="color:red;font-size:14px;">改变选项值，</span>是否继续?
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeStoreCancle">取 消</el-button>
        <el-button type="primary" @click="changeStoreForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserID, getUserManaRange } from '@/utils/auth'
import { str2obj } from '@/utils/multiple'

import { getClassInfo } from '@/api/school'

export default {
  data() {
    return {
      options: [
        { value: '1', label: '一年级' },
        { value: '2', label: '二年级' }
      ],

      // 控制是否隐藏选择年级控件
      showStartGrade: false,

      storeLocation: '初始值',
      changeStoreVisible: false,
      beforeStorageValue: '',
      afterStorageValue: '',

      currentDate: new Date(),
      schoolList: [],
      // schoolList: [
      //   {
      //     schoolId: 4404001,
      //     schoolName: '珠海市香洲区第一小学',
      //     provinceId: 44,
      //     cityid: 4,
      //     areaCode: 440400
      //   },
      //   {
      //     schoolId: 4404002,
      //     schoolName: '珠海共乐幼儿园',
      //     provinceId: 66,
      //     cityid: 4
      //   }
      // ]
      startGrade: 1,
      endGrade: 6,
      classList: []
    }
  },
  // 计算属性
  computed: {
    alertInfo: function() {
      // TODO: 判断用户角色及权限范围并显示对应界面
      const roleType = this.$store.state.user['roleType']
      if (roleType.indexOf('SCHOOL_ADMIN') > -1) {
        return roleType
      } else {
        return '无权限'
      }
    }
  },
  // 监视方法(或用@change属性代替)
  watch: {
    storeLocation: {
      immediate: true,
      handler(val, old) {
        console.log('值已改变')
        console.log('val:', val, 'old:', old)
        if (this.beforeStorageValue && val !== this.beforeStorageValue) {
          // console.log( 'val:', val, 'old:', old,
          //   'this.beforeStorageValue', this.beforeStorageValue
          // )
          // this.changeStoreVisible = true
        }
      }
    }
  },
  mounted() {
    if (getUserID()) {
      // this.$message({
      //   message: 'userId: ' + getUserID(),type: 'info',duration: 3 * 1000})

      // 调用action方法，通常是异步操作
      this.$store.dispatch('user/getUserManaRange').then(() => {
        var schoolarr = getUserManaRange() // from cookie
        if (schoolarr) {
          schoolarr = schoolarr.replace('},{', '}|{')
          schoolarr = schoolarr.replace('[{', '{')
          schoolarr = schoolarr.replace('}]', '}')
          schoolarr = schoolarr.split('|')
          // 若使用foreach，调用方法后是不会改变原数组的值
          // schoolarr.forEach(element => { str2obj(element) })
          // 故使用map迭代器对每一个元素调用方法
          schoolarr = schoolarr.map(str2obj)
          // console.log('index.vue: ', schoolarr[0])
          this.schoolList = schoolarr
        }
        console.log(this.alertInfo)
      })
    }

    this.beforeStorageValue = this.storeLocation
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

    async getClassInfo(chosenSch) {
      // this.$message('点击了： ' + chosenSch['schoolName'])
      // this.$store.dispatch('user/getClassList').then(() => {
      // })

      // 显示年级选择控件
      this.showStartGrade = true

      const reqClassData = {
        startGradeId: this.startGrade,
        endGradeId: this.endGrade,
        schoolId: chosenSch['schoolId']
      }
      var classList = await getClassInfo(reqClassData)
      console.log(classList)

      this.classList = classList
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
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
