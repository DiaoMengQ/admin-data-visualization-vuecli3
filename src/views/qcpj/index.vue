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
      <el-col v-for="(value, key) in schoolList" :key="key" :span="8">
        <el-button :body-style="{ padding: '0px' }" @click="getClassInfo(value)">
          <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
          <div style="padding: 0px;">
            <span>{{ value["schoolName"] }}</span>
            <!-- <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div> -->
          </div>
        </el-button>
      </el-col>
    </el-row>

    <el-tabs type="border-card">
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
    </el-tabs>
  </div>
</template>

<script>
import { getUserID, getUserManaRange } from '@/utils/auth'
import { str2obj } from '@/utils/multiple'
import { async } from 'q'

import { getClassInfo } from '@/api/school'

export default {
  data() {
    return {
      currentDate: new Date(),
      schoolList: []
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
    }
  },
  // 计算属性
  computed: {
    alertInfo: function() {
      // console.log(this.$store.state.user['roles'])
      // TODO: 判断用户角色及权限范围并显示对应界面
      const roles = this.$store.state.user['roles']
      if (roles.indexOf('SCHOOL_ADMIN') > -1) {
        return roles
      } else {
        return '无权限'
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
      }
      )
    }
  },
  methods: {
    async getClassInfo(chosenSch) {
      // this.$message('点击了： ' + chosenSch['schoolName'])
      // this.$store.dispatch('user/getClassList').then(() => {
      // })

      const reqClassData = { 'startGradeId': 1, 'endGradeId': 6, 'schoolId': chosenSch['schoolId'] }
      var classList = await getClassInfo(reqClassData)
      console.log('班级列表： ' + classList)
    },
    onSubmit() {
      this.$message('submit!')
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
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
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
