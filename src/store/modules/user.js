/**
 * * 用户类属性（成员变量）及相关操作（成员方法）
 *
 * * state 用户类成员变量
 *   - token 用户登录后保存的token
 *   - userid 用户ID
 *   - username 用户名
 *   - avatar 用户头像
 *   - roleType 用户角色
 *
 * * Mutations （同步）改变成员变量的方法，以载荷形式分发
 * * Action （异步）改变成员变量的方法，以对象形式分发
 */
import { req4login, getUserInfo, getManaRange, updateToken } from '@/api/user'
import { getUserID, getToken, setUserInfo, removeToken, setUserManaRange } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

var Md54str = require('crypto-js/md5')

const state = {
  createTime: '',
  updateTime: '',
  userid: '',
  username: '',
  avatar: process.env.VUE_APP_BASE_API + '/' + 'default.jpg',
  nickname: '',
  parentId: -1,
  roleType: '',
  roleTypeLabel: '', // 角色类型对应名称标签
  sex: -1,
  status: '',
  tel: -1,
  token: getToken()
}

/**
 * 载荷（payload）
 * 大多数情况下，载荷是一个对象，能够让我们更加易读，更明确地追踪到状态的变化
 * 改变 store 中状态的唯一途径就是显式地提交 (commit) mutation
 *
 * ！只能同步执行！
 *
 * 要触发变化则在组件的 methods 中提交 mutation
 * 动态修改时：e.g.
 * addAge (state)
    Vue.set(state.student, 'age', 18)
    // 或者： state.student = { ...state.student, age: 18 }
 */
const mutations = {
  // 使用常量来替代 mutation 数据改变事件的名字
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, username) => {
    state.username = username
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roleType) => {
    state.roleType = roleType
  },
  SET_ROLESLABEL: (state, roleTypeLabel) => {
    state.roleTypeLabel = roleTypeLabel
  }
}

/**
 * Action 类似于 mutation，不同在于：

 * 1、Action 提交的是 mutation，而不是直接变更状态。
 * 2、Action 可以包含任意*异步*操作，而mutation只能进行*同步*操作。
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

          // 将token保存至本地
          const userInfo = { token: response.headers['access_token'], userid: data['userId'] }
          setUserInfo(userInfo)

          // 调用将token保存至js全局变量（内存中）的方法
          // *注意刷新页面后内存中数据会清空
          // 同步改变全局参数的数值，任何由 commit(XXX) 中XXX导致的状态变更都应该在此刻完成。
          commit('SET_TOKEN', response.headers['access_token'])

          resolve()// 注意不能漏掉这句，这是告诉调用该方法的方法此异步方法已完成
        }).catch(error => {
          console.log('登录失败')
          reject(error)
        })
    })
  },

  // 获取用户信息(除登录行为外获取信息)
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo({ userId: getUserID() }).then(response => {
        const { data } = response.data
        // console.log('API getuserInfo test: ', data)
        if (!data) {
          reject('验证失败，请重新登录.')
        }

        const userInfo = { token: getToken(), userid: data['userId'] }
        setUserInfo(userInfo)

        commit('SET_ROLES', data['roleType'])
        commit('SET_NAME', data['nickname'])
        commit('SET_USERID', data['userId'])
        if (data['headImg'] !== '') {
          commit('SET_AVATAR', process.env.VUE_APP_HEADIMG_API + data['headImg'])
        }

        switch (data.roleType) {
          case 'SUPER_ADMIN':
            commit('SET_ROLESLABEL', '最高权限')
            break
          case 'SCHOOL_ADMIN':
            commit('SET_ROLESLABEL', '校级')
            break
          case 'CITY_ADMIN':
            commit('SET_ROLESLABEL', '市级')
            break

          default:
            break
        }

        const tRoleType = data['roleType']
        // 获取用户权限
        getManaRange().then(response => {
          const roles = response.data.data
          setUserManaRange(tRoleType, roles)
          resolve(data)
        }).catch(error => {
          console.log('getUserInfo: ', '用户权限请求错误 ' + error)
        })

        if (!state.roleType || state.roleType.length <= 0) {
          reject('获取用户角色失败: 请重新登录!')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出账号
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', '')
      commit('SET_NAME', '')
      commit('SET_USERID', '')
      commit('SET_AVATAR', '')
      commit('SET_ROLESLABEL', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // 刷新token
  updateToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      updateToken().then(response => {
        commit('SET_TOKEN', response.headers['access_token'])
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
      commit('SET_ROLES', '')
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
