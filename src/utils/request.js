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
import { parse } from 'querystring'

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
      config.headers['access_token'] = getToken()
    }
    // console.log(config)
    return config
  },
  // 请求错误
  error => {
    console.log('service.interceptors.request: ', error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(response => {
  // console.log('返回的数据： ', response)

  // 如果返回码不是200，则提示错误
  if (response.status !== 200) {
    console.log(`发生错误：${response.status}`)

    // 202: 用户名不存在
    if (response.status === 202) {
      Message({
        message: '用户名不存在！',
        type: 'error',
        duration: 3 * 1000
      })
    }

    return Promise.reject(new Error(response.data.message || '发生错误'))
  } else {
    /**
       * 如果要获取headers or status等http状态信息
       * 则返回 response
       */
    return response
  }
},
// 请求已发出，但服务器响应的状态码不在 2xx 范围内
error => {
  console.log('response error: ', error.response) // for debug
  const res = error.response

  Message({
    message: res.data.msg,
    type: 'error',
    duration: 3 * 1000
  })
  // // 403: 密码错误
  // if (res.status === 403) {
  //   Message({
  //     message: '密码错误！请检查输入的密码',
  //     type: 'error',
  //     duration: 3 * 1000
  //   })
  // }

  // // 401: token过期
  // if (res.status === 401) {
  //   Message({
  //     message: 'Token已过期',
  //     type: 'error',
  //     duration: 3 * 1000
  //   })
  //   store.dispatch('user/updateToken')
  // }

  // // 500: 服务器错误
  // if (res.status === 500) {
  //   Message({
  //     message: '服务器错误',
  //     type: 'error',
  //     duration: 3 * 1000
  //   })
  // }
  return Promise.reject(error)
}
)

export default service
