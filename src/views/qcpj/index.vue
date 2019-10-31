<!--
* 七彩评价页管理项模板
-->
<template>
  <div class="app-container">
    <el-tag>{{ alertInfo }}</el-tag>

    <el-row>

      <el-col v-for="(o, index) in 2" :key="o" :span="8" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
          <div style="padding: 14x;">
            <span>这是一个标题</span>
            <div class="" />
            <!-- <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-tabs type="border-card">
      <li v-for="(value,key) in schoolList" :key="key">
        <span>{{ value }}</span>
      </li>
      <!-- <el-tab-pane label="用户管理">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
    </el-tabs>

  </div>
</template>

<script>
import { getUserID, getUserManaRange } from '@/utils/auth'

export default {
  data() {
    return {
      currentDate: new Date(),
      schoolList: [
        { schoolId: 4404001, schoolName: '珠海市香洲区第一小学', provinceId: 44, cityid: 4, areaCode: 440400 },
        { schoolId: 4404002, schoolName: '珠海共乐幼儿园', provinceId: 66, cityid: 4 }]
    }
  },
  // 计算属性
  computed: {
    alertInfo: function() {
      console.log(this.$store.state.user['roles'])
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
      this.$message({
        message: 'userId: ' + getUserID(),
        type: 'info',
        duration: 3 * 1000
      })

      this.$store.dispatch('user/getUserManaRange')
      const manaRange = getUserManaRange()
      if (manaRange) {
        this.schoolList = manaRange
      }
    }
  },
  methods: {
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
      clear: both
  }
</style>
