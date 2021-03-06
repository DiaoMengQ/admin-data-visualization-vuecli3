/**
 * 权限控制管理
 */

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从localStorage中拿取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 每次进入新路由页都会先执行此钩子
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()
  const userID = store.state.user['userid']

  // 如果已登录，则重定向到主页
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      // 进度条加载完成动画
      NProgress.done()
    } else {
      if (userID) {
        next()
      } else {
        try {
          // 同步获取用户信息
          const { roleType } = await store.dispatch('user/getUserInfo')
          // 基于角色生成可访问路由图
          const accessRoutes = await store.dispatch('permission/generateRoutes', [roleType])
          // 动态添加可访问路由
          router.options.routes.push(...accessRoutes)
          router.addRoutes(accessRoutes)

          // 确保addRoutes完整的hack方法
          // replace:true，导航不会留下历史记录
          next({ ...to, replace: true })
          // next()
        } catch (error) {
          // 如果获取错误,则删除token,进入登录页面重新登录
          console.log(error)
          store.dispatch('user/resetToken')
          Message.error('token已过期,请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 无token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
