/** 用于获取Vue页面传过来的数据以及发送网络请求 */
import { login, logout, getInfo } from '@/api/user'
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
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      const pwd = Md54str(password)
      console.log('view/index.vue: 加密后数据' + pwd)
      // 传输用户名和加密后的数据
      login({ username: username.trim(), password: pwd.toString() })
        // .then((data)=>{ })里的data是指接口成功返回的数据,包含请求头,请求体,等信息
        // .then(response => {
        //   const { data } = response
        //   commit('SET_TOKEN', data.token)
        //   setToken(data.token)
        //   resolve()
        //   // console.log('view/index.vue: 请求返回的token' + data.token)
        // }).catch(error => {
        //   console.log('view/index.vue: 请求错误 ' + error)
        //   reject(error)
        // })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
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
