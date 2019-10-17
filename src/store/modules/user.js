/** 用于获取Vue页面传过来的数据以及发送网络请求 */
import { req4login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

var Md54str = require('crypto-js/md5')

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

/**
 * 载荷（payload）
 * 大多数情况下，载荷是一个对象，能够让我们更加易读，更明确地追踪到状态的变化
 * 通过 store.commit 触发
 * ！！只能同步执行！！
 * 
 * 动态修改时：e.g. 
 * addAge (state) {
    Vue.set(state.student, 'age', 18)
    // 或者： state.student = { ...state.student, age: 18 }
   }
 * 使用常量来替代 mutation 事件的名字
 */
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

/**
 * Action 类似于 mutation，不同在于：

 * 1、Action 提交的是 mutation，而不是直接变更状态。
 * 2、Action 可以包含任意！异步！操作。
 * 
 * 通过 store.dispatch 方法触发
 */
const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    /**
     * Promise对象
     * 先统一执行AJAX逻辑，不关心如何处理结果，
     * 再根据结果是成功还是失败，在将来的某个时候调用success函数或fail函数。
     * 
     * (resolve,reject)两个参数都为函数
     * 如果执行成功则调用resolve(),执行失败则调用reject()
     */
    return new Promise((resolve, reject) => {
      // 传输用户名和加密后的数据
      const pwd = Md54str(password).toString()
      // console.log('store/user.js: 加密后数据: ' + pwd.toString())
      req4login({ username: username.trim(), password: pwd })
        .then(response => {
          Message({
            message: 'response.code = ' + response.code + ' ' + '登录成功',
            type: 'info',
            duration: 5 * 1000
          })
          const { headers } = response
          if (response.data.code === 200) {
            console.log(response.headers['access_token'])
            localStorage.setItem('user-token', response.headers['access_token'])
          }
          // 同步改变全局参数的数值，任何由 commit(XXX) 中XXX导致的状态变更都应该在此刻完成。
          commit('SET_TOKEN', headers['access_token']) 
          setToken(headers['access_token'])
          resolve()
        }).catch(error => {
        // console.log('请求错误 ' + error)
          reject(error)
        })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    console.log(commit)
    return new Promise((resolve, reject) => {
      console.log(state.token)
      getInfo({ userId: state.userid }).then(response => {
        const { data } = response
        console.log(response)

        if (!data) {
          reject('验证失败，请重新登录.')
        }

        const { name, userid, avatar } = data

        commit('SET_NAME', name)
        commit('SET_USERID', userid)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出账号
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
