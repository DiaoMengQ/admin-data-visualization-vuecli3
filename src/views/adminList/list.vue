<!--
* 平台管理人员列表及管理
-->
<template>
  <div class="app-container">

    <el-input
      v-model="searchFilter"
      placeholder="输入账户登录名的任意关键字进行搜索"
    />
    <el-table
      v-loading="listLoading"
      :default-sort="{prop: 'time', order: 'descending'}"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :data="adminList.filter(data => !searchFilter || data.username.toLowerCase().includes(searchFilter.toLowerCase()))"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <router-link :to="'/administration/adminEdit/'+scope.row['userId']">
            {{ scope.row['userId'] }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column prop="username" label="登录名" align="center">
        <!-- {{ adminList.username }} -->
        <template slot-scope="scope">
          <router-link :to="'/administration/adminEdit/'+scope.row['userId']">
            {{ scope.row['username'] }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row['nickname'] }}
        </template>
      </el-table-column>

      <el-table-column
        :filters="[{ text: '最高权限', value: '最高权限' }, { text: '校级', value: '校级' }, { text: '市级', value: '市级' }]"
        :filter-method="filterRoleTypeLabel"
        prop="roleTypeLabel"
        label="权限范围"
        align="center"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row['roleTypeLabel'] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :filters="[{ text: '已冻结', value: '已冻结' }, { text: '正常使用', value: '正常使用' }]"
        :filter-method="filterStatueLabel"
        prop="statusLabel"
        label="账户状态"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row['statusLabel'] }}
        </template>
      </el-table-column>

      <el-table-column label="联系方式" align="center">
        <!-- {{ adminList.creatorID }} -->
        <template slot-scope="scope">
          {{ scope.row['tel'] }}
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        align="center"
        width="130"
        prop="time"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row['createTime'] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="管理操作"
        align="center"
        min-width="120px"
      >
        <template slot-scope="scope">
          <router-link :to="'/administration/adminEdit/'+scope.row['userId']">
            <el-button type="primary" plain>
              查看
            </el-button>
          </router-link>
          <el-button v-show="scope.row['isShowManaBtn']" type="danger" plain @click="frozenAdminAccount(scope.row['userId'])">
            冻结
          </el-button>
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
      listLoading: true,
      searchFilter: '' // 搜索过滤器
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    // 表单账户状态标签过滤器
    filterStatueLabel(value, row) {
      return row.statusLabel === value
    },
    // 表单账户权限级别标签过滤器
    filterRoleTypeLabel(value, row) {
      return row.roleTypeLabel === value
    },
    // 冻结管理员账户
    frozenAdminAccount(adminID) {
      console.log(adminID)
    },
    // 拉取数据
    fetchData() {
      // 获取自身管理级别下管理员列表
      getAdminList({ parentId: this.$store.state.user['userid'] })
        .then(response => {
          this.adminList = response.data.data
          console.log(this.adminList)
          this.listLoading = false

          // 判断是否允许现实操作按钮
          for (let i = 0; i < this.adminList.length; i++) {
            if (this.adminList[i].status === 'blocked') {
              this.adminList[i].statusLabel = '已冻结'
              this.adminList[i].isShowManaBtn = false
            } else {
              this.adminList[i].statusLabel = '正常使用'
              this.adminList[i].isShowManaBtn = true
            }

            switch (this.adminList[i].roleType) {
              case 'SUPER_ADMIN':
                this.adminList[i].roleTypeLabel = '最高权限'
                break
              case 'SCHOOL_ADMIN':
                this.adminList[i].roleTypeLabel = '校级'
                break
              case 'CITY_ADMIN':
                this.adminList[i].roleTypeLabel = '市级'
                break

              default:
                break
            }
          }
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
