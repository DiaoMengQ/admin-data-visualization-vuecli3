import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { routes } from './constantRoutes'

/**
 * Note: 路由的次级菜单仅在子路由数 >1 时出现
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             该名称用于 <keep-alive> (必须设置!)
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             侧边栏显示图标
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 * children: 以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path
 */

/**
 * 固定的路由
 * 没有权限要求，所有角色都可访问
 */
export const constantRoutes = routes()

export const asyncRoutes = [
  // *系统相关数据
  {
    path: '/systemData',
    replace: true,
    component: Layout,
    redirect: '/systemData/accessDevicesData',
    name: 'systemData',
    meta: { title: '系统相关数据', roles: ['SUPER_ADMIN'], icon: 'histogram' },
    children: [
      {
        path: 'accessAreaData',
        name: 'AccessAreaData',
        component: () => import('@/views/systemData/accessAreaData'),
        meta: { title: '用户访问区域统计', icon: 'international' }
      },
      {
        path: 'accessDevicesData',
        name: 'AccessDevicesData',
        component: () => import('@/views/systemData/accessDevicesData/index'),
        meta: { title: '系统访问设备统计', icon: 'devices' }
      },
      {
        path: 'responseCodeCount',
        name: 'responseCodeCount',
        component: () => import('@/views/systemData/responseCodeCount'),
        meta: { title: '访问响应码统计', icon: 'warn' }
      },
      {
        path: 'accessDurationData',
        name: 'accessDurationData',
        component: () => import('@/views/systemData/accessDurationData'),
        meta: { title: '系统访问数统计', icon: 'time' }
      }
    ]
  },

  // *人员管理
  {
    path: '/administration',
    component: Layout,
    meta: { title: '人员管理', roles: ['SUPER_ADMIN', 'CITY_ADMIN'], icon: 'member' },
    redirect: '/administration/adminList',
    children: [{
      path: 'adminList',
      name: 'adminList',
      component: () => import('@/views/adminList/list'),
      meta: { title: '账户列表', icon: 'tree' }
    },
    {
      path: 'adminCreate',
      name: 'adminCreate',
      component: () => import('@/views/adminList/create'),
      meta: { title: '添加账户', icon: 'cteate-member', noCache: true }
    },
    {
      path: 'adminEdit/:id(\\d+)',
      name: 'adminEdit',
      component: () => import('@/views/adminList/edit'),
      meta: { title: '账户信息', noCache: true },
      hidden: true
    }
    ]
  },

  // 此处是所有路由地址都找不到后的最后路径,必须放在末尾
  { path: '*', replace: true, redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // 需要服务器支持
  base: process.env.NODE_ENV === 'production' ? '/admin/' : '/', // 部署到Tomcat必须写
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 参考资料: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 由于官方未提供重置路由的方法，只能手动重置配置项
export function resetRouter() {
  const newRouter = new Router({
    mode: 'history',
    base: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
    scrollBehavior: () => ({ y: 0 }),
    routes: routes()
  })

  router.options = newRouter.options
  router.matcher = newRouter.matcher
}

export default router
