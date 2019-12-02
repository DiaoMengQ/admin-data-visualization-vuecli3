/* eslint-disable no-unused-vars */
/**
 * axios
 * 网络请求与返回数据拦截
 * 拦截后进行参数配置
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getUserID } from '@/utils/auth'

import Cookies from 'js-cookie'
import { type } from 'os'

const TokenKey = 'user-token'

// 创建axios实例
const service = axios.create({
  // 请求的基础路径 base_url
  baseURL: process.env.VUE_APP_BASE_API,
  // 发送cookie
  // withCredentials: true,
  // 请求头附加信息
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  // 在向服务器发送前，对请求数据格式进行处理
  transformRequest: [function(data) {
    // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    let res4format = ''
    for (const it in data) {
      res4format += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    res4format = res4format.substring(0, res4format.lastIndexOf('&'))
    // console.log('转换结果' + res4format)
    return res4format
  }],
  timeout: 4 * 1000 // 请求超时
})

// 请求拦截器 即请求发送前操作
service.interceptors.request.use(
  config => {
    if (getToken()) {
      // 让每一个请求带上token，['XXX'] 自定义请求头key
      // console.log(getToken())
      // config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
      config.headers['access_token'] = getToken()
    }
    // console.log(config) // for debug
    return config
  },
  // 请求错误
  error => {
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 通过返回的代码确定请求状态
   */
  response => {
    const res = response.data
    // console.log('返回的数据： ')
    // console.log(res)

    // 如果返回码不是200，则提示错误
    if (res.code !== 200) {
      Message({
        message: res.msg || '发生错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 500: 服务器错误
      if (res.code === 500) {
        Message({
          message: '服务器错误' + res,
          type: 'error',
          duration: 3 * 1000
        })
      }
      // 508: 非法token; 512: 账号在其他端登入; 514: Token expired;
      if (res.code === 508 || res.code === 512 || res.code === 514 || res.code === 401) {
        // 跳转 重新登录
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
      /**
       * 如果要获取headers or status等http状态信息
       * 则返回 response
       */
      // console.log(response)
      return response
    }
  },
  error => {
    console.log('请求时' + error) // for debug
    Message({
      message: error,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
