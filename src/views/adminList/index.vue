<!--
* 平台管理人员列表及管理
-->
<template>
  <div class="app-container">

    <el-table
      v-loading="listLoading"
      :data="adminList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="175">
        <template slot-scope="scope">
          {{ scope.row['userId'] }}
        </template>
      </el-table-column>

      <el-table-column label="登录名" align="center">
        <!-- {{ adminList.adminName }} -->
        <template slot-scope="scope">
          {{ scope.row['username'] }}
        </template>
      </el-table-column>

      <el-table-column label="管理员类型" align="center" width="110">
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
          <router-link :to="'/adminList/edit/'+scope.row['userId']">
            <el-button type="primary" plain size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button type="danger" plain @click="frozenAdminAccount(scope.row['userId'])">
            冻结
          </el-button>
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
import { getAdminList } from '@/api/user'

export default {
  data() {
    return {
      adminList: [],
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    frozenAdminAccount(adminID) {
      console.log(adminID)
    },
    // 拉取数据
    fetchData() {
      // 获取自身管理级别下管理员列表
      getAdminList({ parentId: this.$store.state.user['userid'] })
        .then(response => {
          this.adminList = response.data.data
          this.listLoading = false
        })
        .catch(error => {
          console.log('请求错误 ' + error)
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
