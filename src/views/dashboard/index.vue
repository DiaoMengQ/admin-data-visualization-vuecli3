<template>
  <div class="dashboard-container">
    <!-- 需要获取值的键（相当于ID） -->
    <!-- <div class="dashboard-text">当前用户: {{ name }}</div> -->
    <div class="dashboard-text">当前用户: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>
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
  /**
   * computed 这个计算属性接收的是一个对象
   * 主要作用是把数据存储到内存中，减少不必要的请求
   * 还可以利用computed给子组件的data赋值
   */
  computed: {
    /**
     * 可以直接把需要用到的状态全部存放在 mapGetters 里面进行统一管理，而且还可以取别名，做额外的操作等等。
     * 如果所映射的计算属性名称与 state 的子节点名称相同时，还可以更加简化，给 mapGetters 传一个字符串数组：
     */
    ...mapGetters([
      // 映射 this.name 为 store.state.name
      // 使用对象展开运算符将此对象混入到外部对象中
      'name',
      'roles'
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
