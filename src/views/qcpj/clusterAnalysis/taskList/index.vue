<template>
  <div class="app-container">

    <el-input
      v-model="searchFilter"
      placeholder="输入任务名称的任意关键字进行搜索"
    />
    <!-- 任务列表 -->
    <!-- el-table属性: https://element.eleme.cn/#/zh-CN/component/table -->
    <el-table
      v-loading="listLoading"
      :default-sort="{prop: 'time', order: 'descending'}"
      stripe
      :data="taskList.filter(data => !searchFilter || data.taskName.toLowerCase().includes(searchFilter.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="time" sortable align="center" label="创建时间" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row['createTime'] }}</span>
        </template>
      </el-table-column>

      <!-- 点击文本跳转编辑 -->
      <el-table-column prop="taskName" min-width="120px" label="任务名称">
        <template slot-scope="scope">
          <router-link :to="'/qcpj/clusterAnalysis/taskDetail/'+scope.row['id']" class="link-type">
            <span>{{ scope.row['taskName'] }}</span>
          </router-link>
        </template>
      </el-table-column>

      <!-- 处理状态 -->
      <el-table-column
        :filters="[{ text: '已完成', value: '已完成' }, { text: '发生错误', value: '发生错误' }, { text: '准备中', value: '准备中' }]"
        :filter-method="filterTag"
        prop="tagType"
        align="center"
        label="处理状态"
        width="110"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.tagType">{{ scope.row['curStatusLabel'] }}</el-tag>
        </template>
      </el-table-column>

      <!-- 处理详情 -->
      <el-table-column align="center" label="处理详情" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row['msg'] }}</span>
        </template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column align="center" label="备注" width="210px">
        <template slot-scope="scope">
          <span>{{ scope.row['remarks'] }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getSubjectClusterList } from '@/api/qcpj'
export default {
  data() {
    return {
      searchFilter: '', // 搜索过滤器
      listLoading: false,
      taskList: [] // 任务列表
    }
  },
  mounted() {
    getSubjectClusterList().then(result => {
      this.taskList = result.data.data
      this.taskList.curStatusLabel = ''
      this.taskList.forEach(element => {
        switch (element.curStatus) {
          case 0:
            element.curStatusLabel = '准备中'
            element.tagType = 'info'
            break
          case 1:
            element.curStatusLabel = '已完成'
            element.tagType = 'success'
            break
          case 2:
            element.curStatusLabel = '发生错误'
            element.tagType = 'danger'
            break

          default:
            break
        }
      })
    //   console.log(this.taskList)
    }).catch((err) => {
      console.log(err)
    })
  },
  methods: {
    filterTag(value, row) {
      return row.curStatusLabel === value
    }
  }
}
</script>

<style>
.app-container{
    margin: 20px
}
</style>
