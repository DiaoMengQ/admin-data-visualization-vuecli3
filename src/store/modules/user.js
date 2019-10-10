/** 用于获取Vue页面传过来的数据以及发送网络请求 */
import { req4login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

var Md54str = require('crypto-js/md5')

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

// 重载
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

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 传输用户名和加密后的数据
      const pwd = Md54str(password).toString()
      // console.log('store/user.js: 加密后数据: ' + pwd.toString())

      req4login({ username: username.trim(), password: pwd })
        .then(response => {
          const { headers } = response
          commit('SET_TOKEN', headers['access_token']) // 设置路由状态,使用commit是为了方便追踪
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
