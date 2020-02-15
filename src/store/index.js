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
  getters,
  state: {
    token: '',
    Grade: [],
    Class: [],
    Stu: []
  },
  mutations: {
    // 对token进行监管
    set_token(state, token) {
      state.token = token
      localStorage.token = token
    },
    // 对年级信息进行存储
    setGrade(state, grade) {
      state.Grade = grade
    },
    // 对班级信息进行存储
    setClass(state, thisclass) {
      state.Class = thisclass
    },
    // 获取学生每周分数
    setStu(state, stu) {
      state.Stu = stu
    }
  },
  actions: {
    commitGrade: ({ commit }, Grade) => commit('setGrade', Grade)
  }
})

export default store
