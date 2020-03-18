<template>
  <div class="home-container">
    <!-- 需要获取值的键（相当于ID） -->
    <div class="home-text">当前用户:  {{ username }}</div>
    <div class="home-text">用户身份:  {{ roleType }} {{ roleTypeLabel }}管理员</div>
    <div class="home-text">管辖范围:
      <span
        v-for="(manaRangeItem,key) in manaRangeLabelList"
        :key="key"
      > {{ manaRangeItem }}
      </span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserManaRange } from '@/utils/auth'

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
  data() {
    return {
      manaRange: '',
      manaRangeLabelList: []
    }
  },
  computed: {
    /**
     * 可以直接把需要用到的状态全部存放在 mapGetters 里面进行统一管理，而且还可以取别名，做额外的操作等等。
     * 如果所映射的计算属性名称与 state 的子节点名称相同时，还可以更加简化，给 mapGetters 传一个字符串数组：
     */
    ...mapGetters([
      // 映射 this.username 为 store.state.username
      // 使用对象展开运算符将此对象混入到外部对象中
      'username',
      'roleType',
      'roleTypeLabel'
    ])
  },
  mounted() {
    this.manaRange = getUserManaRange(this.roleType)
    let manaRangeLabelItem = ''
    switch (this.roleType) {
      case 'SUPER_ADMIN':
        manaRangeLabelItem = '无限制'
        this.manaRangeLabelList.push(manaRangeLabelItem)
        break
      case 'CITY_ADMIN':
        for (let i = 0; i < this.manaRange.length; i++) {
          manaRangeLabelItem = this.manaRange[i].provinceName + this.manaRange[i].cityName
          this.manaRangeLabelList.push(manaRangeLabelItem)
        }
        break
      case 'SCHOOL_ADMIN':
        for (let i = 0; i < this.manaRange.length; i++) {
          manaRangeLabelItem = this.manaRange[i].schoolName
          this.manaRangeLabelList.push(manaRangeLabelItem)
        }
        break
      default:
        break
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
