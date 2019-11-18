<!--
* 平台管理人员列表及管理
-->
<template>
  <div class="app-container">

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.row['userId'] }}
        </template>
      </el-table-column>

      <el-table-column label="姓名" align="center">
        <!-- {{ adminList.adminName }} -->
        <template slot-scope="scope">
          {{ scope.row['username'] }}
        </template>
      </el-table-column>

      <el-table-column label="管理类型" align="center" width="110">
        <span>{{ adminList.roletype }}</span>

        <template slot-scope="scope">
          <span>{{ scope.row['roleType'] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建者ID" align="center" width="110">
        <!-- {{ adminList.creatorID }} -->
        <template slot-scope="scope">
          {{ scope.row['parentId'] }}
        </template>
      </el-table-column>

      <el-table-column label="联系方式" align="center" width="110">
        <!-- {{ adminList.creatorID }} -->
        <template slot-scope="scope">
          {{ scope.row['tel'] }}
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="管理操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="danger" @click="deleteAdminAccount(scope.row['userId'])">
            删除
          </el-tag>
          <el-tag @click="updateAdminAccount(scope.row['userId'])">
            修改
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        width="130"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row['createTime'] }}</span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
import { getAdminList, getUserInfo } from '@/api/user'

export default {
  data() {
    return {
      adminList: {
        adminID: '',
        adminName: '',
        nickName: '',
        roleType: '',
        tel: '',
        sex: '',
        parentId: '',
        creatorID: ''
      },
      list: null,
      listLoading: true
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
    // 获取自身管理级别下管理员列表
    // console.log(this.$store.state.user['userid'])
    getAdminList({ parentId: this.$store.state.user['userid'] })
      .then(response => {
        this.adminList = response.data
        this.adminList.adminID = response.data['userId']
        // console.log('index.vue/getAdminList: ', response.data)
      })
      .catch(error => {
        console.log('请求错误 ' + error)
      })
  },
  created() {
    this.fetchData()
  },

  methods: {
    deleteAdminAccount(adminID) {
      console.log(adminID)
    },
    updateAdminAccount(adminID) {
      // console.log(adminID)
      getUserInfo({ 'userId': adminID }).then(response => {
        console.log(response.data)
      })
    },
    fetchData() {
      this.listLoading = true
      getAdminList({ parentId: this.$store.state.user['userid'] }).then(response => {
        // console.log('index.vue/getAdminList: ', response.data.data)
        this.list = response.data.data
        this.listLoading = false
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
