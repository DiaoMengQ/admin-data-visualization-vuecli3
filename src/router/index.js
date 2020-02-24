import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
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
 * 没有权限要求的基本页
 * 所有角色都可访问
 */
export const constantRoutes = [
  // *登录页
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // *404错误页
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // *主页
  {
    path: '/', // Url相对根路径路径
    component: Layout,
    redirect: '/home', // 重定向路径（可以直接写路径，也可以写成“ redirect:{ name:'foo'} ”）
    children: [{
      path: 'home', // url显示的路径
      name: 'home', // 用于路由间的调用
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // *七彩评价相关
  // 页面加载时默认获取市级管理员管辖区域，提供选择学校功能
  {
    path: '/qcpj',
    component: Layout,
    meta: {
      title: '七彩评价',
      icon: 'tree'
    },
    redirect: '/qcpj/groupProfile', // 点击父级目录'七彩评价'的默认路径
    children: [
      {
        path: 'groupProfile',
        component: () => import('@/views/qcpj/groupProfile/index'), // Parent router-view
        name: 'GroupProfile',
        meta: { title: '群体画像' },
        children: [{
          path: 'teaEvaAvg',
          meta: { title: '班级评价积分平均值' },
          component: () => import('@/views/qcpj/groupProfile/teaEvaAvg/index'),
          children: [{
            path: 'bar',
            meta: { title: '柱状图' },
            component: () => import('@/views/qcpj/groupProfile/teaEvaAvg/BarChart')
          }, {
            path: 'radar',
            meta: { title: '雷达图' },
            component: () => import('@/views/qcpj/groupProfile/teaEvaAvg/RadarChart')
          }, {
            path: 'line',
            meta: { title: '折线图' },
            component: () => import('@/views/qcpj/groupProfile/teaEvaAvg/LineChart')
          }]
        }]
      },
      {
        path: 'clusterAnalysis',
        name: 'ClusterAnalysis',
        component: () => import('@/views/qcpj/clusterAnalysis/index'),
        redirect: '/qcpj/clusterAnalysis/taskList',
        meta: { title: '科目成绩聚类分析' },
        children: [
          {
            path: 'taskList',
            component: () => import('@/views/qcpj/clusterAnalysis/taskList'),
            name: 'taskList',
            meta: { title: '任务列表' }
          },
          {
            path: 'taskDetail/:taskId(\\d+)',
            component: () => import('@/views/qcpj/clusterAnalysis/taskDetail'),
            name: 'taskDetail',
            meta: { title: '任务详情' },
            hidden: true
          },
          {
            path: 'createTask',
            component: () => import('@/views/qcpj/clusterAnalysis/taskCreate/index'),
            name: 'createTask',
            meta: { title: '创建任务' }
          },
          {
            path: 'createTask/info/:schoolId(\\d+)',
            component: () => import('@/views/qcpj/clusterAnalysis/taskCreate/taskInfo'),
            name: 'createTaskInfo',
            meta: { title: '任务编辑', noCache: true },
            hidden: true
          }
        ]
      }
    ]
  },

  // *阅读海洋相关
  {
    path: '/ydhy',
    component: Layout,
    redirect: '/ydhy/menu1',
    name: 'ydhy',
    meta: {
      title: '阅读海洋',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/ydhy/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/ydhy/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/ydhy/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/ydhy/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/ydhy/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/ydhy/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'gthx',
        component: () => import('@/components/LJH/gthx'),
        meta: {
          title: '个体画像',
          keepAlive: true
        }
      },
      {
        path: 'moreStudent',
        component: () => import('@/components/LJH/moreStudent'),
        name: 'MoreStudent'
      }
    ]
  },

  // *图表
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '系统相关数据', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '系统访问设备统计', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '用户访问区域分布', icon: 'tree' }
      }
    ]
  },

  // *人员管理
  {
    path: '/administration',
    component: Layout,
    meta: { title: '人员管理', icon: 'tree' },
    redirect: '/administration/adminList',
    children: [{
      path: 'adminList',
      name: 'adminList',
      component: () => import('@/views/adminList/list'),
      meta: { title: '账户列表' }
    },
    {
      path: 'adminCreate',
      name: 'adminCreate',
      component: () => import('@/views/adminList/create'),
      meta: { title: '添加账户', noCache: true }
    },
    {
      path: 'adminEdit/:id(\\d+)',
      name: 'adminEdit',
      component: () => import('@/views/adminList/edit'),
      meta: { title: '账户信息编辑', noCache: true },
      hidden: true
    }
    ]
  },

  // *备用连接
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404页必须放在末尾！！
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // 需要服务器支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
