<template>
  <admin-detail :is-edit="true" />
</template>

<script>
import AdminDetail from './components/AdminDetail'

export default {
  /**
   * 虽然引用的是同一个组件，仍可以以不同的命名进行复用
   * 如Java中的继承
   */
  name: 'EditForm',
  components: { AdminDetail }
}
</script>
