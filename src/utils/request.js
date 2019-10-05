import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 当跨域请求时发送cookie
  timeout: 5000 // 请求超时
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 请求发送前操作

    if (store.getters.token) {
      // 让每一个请求都带上token
      // ['X-Token'] 自定义请求头key
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  /**
   * 如果要获取headers or status等http状态信息
   * 要先 return  response => response
  */
  response => {
    return response
  },
  /**
   * 通过返回的代码确定请求状态
   */
  response => {
    const res = response.data

    // 如果返回码不是200，则提示错误
    if (res.code !== 200) {
      Message({
        message: res.message || '发生错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 508: 非法token; 512: 账号在其他端登入; 50014: Token expired;
      if (res.code === 508 || res.code === 512 || res.code === 514) {
        // to re-login
        MessageBox.confirm('您已注销，您可以取消以停留在此页，或重新登录', '确定', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || '发生错误'))
    } else {
      return res
    }
  },
  error => {
    console.log('错误：' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
