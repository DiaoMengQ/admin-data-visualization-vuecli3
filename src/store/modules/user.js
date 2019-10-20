/** 用于获取Vue页面传过来的数据以及发送网络请求 */
import { req4login, getInfo } from '@/api/user'
import { getUserID, getToken, setUserInfo, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

var Md54str = require('crypto-js/md5')

const state = {
  token: getToken(),
  userid: '',
  name: '',
  avatar: '',
  roles: []
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
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
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
            message: response.data.code + '\t' + '登录成功',
            type: 'info',
            duration: 3 * 1000
          })
          const { data } = response.data
          console.log(data)

          // 将token保存至本地
          const userInfo = { token: response.headers['access_token'], userid: data['userId'] }
          setUserInfo(userInfo)

          // 调用将token保存至js全局变量（内存中）的方法
          // *注意刷新页面后内存中数据会清空
          // 同步改变全局参数的数值，任何由 commit(XXX) 中XXX导致的状态变更都应该在此刻完成。
          commit('SET_TOKEN', response.headers['access_token'])
          commit('SET_ROLES', data['roleType'])
          commit('SET_NAME', data['nickname'])
          commit('SET_USERID', data['userId'])
          // commit('SET_AVATAR', data['headImg'])
          commit('SET_AVATAR', 'http://172.20.13.20/default.jpg')

          resolve()
        }).catch(error => {
          console.log('请求错误 ' + error)
          reject(error)
        })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    // console.log(state.token)

    return new Promise((resolve, reject) => {
      getInfo({ userId: getUserID() }).then(response => {
        const { data } = response
        console.log(response)

        if (!data) {
          reject('验证失败，请重新登录.')
        }

        const { roles, name, userid, avatar } = data
        if (!roles || roles.length <= 0) {
          reject('getInfo: 角色必须是非空数组!')
        }

        commit('SET_ROLES', roles)
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
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
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
