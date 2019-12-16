<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  /**
   * 虽然引用的是同一个组件，仍可以以不同的命名进行复用
   * 如Java中的继承
   */
  name: 'EditForm',
  components: { ArticleDetail }
}
</script>
