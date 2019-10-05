<template>
  <div class="dashboard-container">
    <div class="dashboard-text">当前用户: {{ name }}</div><!-- 需要获取值的键（相当于ID） -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// default中只能设定一个模块
export default {
  // 设定模块名称，只有作为组件时起作用
  // 允许组件模块递归地调用自己
  // 便于调试，发生错误时有更容易辨别的警告信息
  name: 'Dashboard',
  computed: {
    // 需要获取的值对应的键
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
