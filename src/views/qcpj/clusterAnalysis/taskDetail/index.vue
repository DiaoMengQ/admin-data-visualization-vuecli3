<template>
  <div class="app-container">

    <el-tag>任务ID: {{ taskId }}</el-tag>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  data() {
    return {
      taskId: ''
    }
  },
  created() {
    this.taskId = this.$route.params && this.$route.params.taskId
  },
  mounted() {

  }
}
</script>

<style>
.app-container{
    margin: 20px
}
</style>
