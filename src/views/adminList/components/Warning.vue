<template>
  <aside>
    keep-alive无法缓存创建和编辑页面，因为keep-alive包含当前不支持
    基于路由的缓存，因此它当前是基于组件名称进行缓存的。如果要实现类似的
    缓存效果是，您可以使用浏览器缓存方案，如localStorage。或者不使用keep alive include
    来缓存所有直接翻页。点击查看详细信息 👉
    <a
      href="https://panjiachen.github.io/vue-element-admin-site/guide/essentials/tags-view.html"
      target="_blank"
    >Document</a>
  </aside>
</template>
