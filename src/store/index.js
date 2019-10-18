import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'

/**
 * 引入Vuex，管理状态数据
 */
Vue.use(Vuex)

/**
 * store本质上是一个容器，储存应用中大部分的状态 (state in store/modules/app.js)
 */
const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user
  },
  getters
})

export default store
