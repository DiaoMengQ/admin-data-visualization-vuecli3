import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * 如果你不想使用模拟服务器, 而使用MockJs的模拟api
 * 你可以执行:mockXHR()
 *
 * 目前MockJs将在生产环境中使用，
 * 需在上线前删除
 */
// import {
//   mockXHR
// } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// 设置默认语言为中文
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  // 把 store 对象提供给 “store” 选项，
  // 这可以把 store 的实例注入所有的子组件
  store,
  render: h => h(App)
})
