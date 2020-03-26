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
    redirect: '/home', // 点击父级目录的重定向路径（可以直接写路径，也可以写成“ redirect:{ name:'foo'} ”）
    children: [{
      path: 'home', // url显示的路径
      name: 'home', // 用于路由间的调用
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    },
    {
      path: 'personalInfo/:id(\\d+)',
      name: 'personalInfo',
      component: () => import('@/views/home/personalInfo'),
      meta: { title: '个人资料' },
      hidden: true
    }]
  },

  // *七彩评价相关
  // 页面加载时默认获取市级管理员管辖区域，提供选择学校功能
  {
    path: '/qcpj',
    component: Layout,
    meta: { title: '七彩评价', icon: 'qcpj' },
    redirect: '/qcpj/teaEvaAvg',
    children: [
      {
        path: 'groupProfile',
        component: () => import('@/views/qcpj/groupProfile/index'), // Parent router-view
        name: 'qcpjGroupProfile',
        meta: { title: '群体评价积分', icon: 'group' },
        children: [
          {
            path: 'teaEvaAvg',
            component: () => import('@/views/qcpj/groupProfile/teaEvaAvg/BarChart'),
            name: 'TeaEvaAvg',
            meta: { title: '班级评价积分平均值' }
          },
          {
            path: 'linearRegression',
            component: () => import('@/views/qcpj/groupProfile/LinearRegression'), // Parent router-view
            name: 'LinearRegression',
            meta: { title: '评价积分线性回归分析' }
          },
          {
            path: 'studentsLinear',
            component: () => import('@/views/qcpj/groupProfile/LinearRegression/studentsLiner'), // Parent router-view
            name: 'studentsLinear',
            meta: { title: '班级线性回归' },
            hidden: true
          }
        ]
      },
      {
        path: 'personalProfile',
        component: () => import('@/views/qcpj/personalProfile/index'), // Parent router-view
        name: 'personalProfile',
        meta: { title: '学生评价积分', icon: 'person' },
        children: [
          {
            path: 'totalPoints',
            name: 'totalPoints',
            meta: { title: '评价积分统计' },
            component: () => import('@/views/qcpj/personalProfile/studentPoints/totalPoints')
          },
          {
            path: 'pointsTrend',
            name: 'pointsTrend',
            meta: { title: '评价积分趋势' },
            component: () => import('@/views/qcpj/personalProfile/studentPoints/pointsTrend')
          },
          {
            path: 'pointswave',
            name: 'pointswave',
            meta: { title: '评价积分波动' },
            component: () => import('@/views/qcpj/personalProfile/studentPoints/pointswave')
          }
        ]
      },
      {
        path: 'clusterAnalysis',
        name: 'ClusterAnalysis',
        component: () => import('@/views/qcpj/clusterAnalysis/index'),
        redirect: '/qcpj/clusterAnalysis/taskList',
        meta: { title: '科目积分聚类分析', icon: 'cluster' },
        children: [
          {
            path: 'taskList',
            component: () => import('@/views/qcpj/clusterAnalysis/taskList'),
            name: 'taskList',
            meta: { title: '任务列表', icon: 'list' }
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
            meta: { title: '创建任务', icon: 'create-item' }
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
    redirect: '/ydhy/groupProfile',
    name: 'ydhy',
    meta: { title: '阅读海洋', icon: 'ydhy' },
    children: [
      {
        path: 'groupProfile',
        component: () => import('@/views/ydhy/groupProfile/index'), // Parent router-view
        redirect: '/ydhy/groupProfile/readingMession',
        name: 'RoGroupProfile',
        meta: { title: '群体阅读数据', icon: 'group' },
        children: [
          {
            path: 'readingMession',
            component: () => import('@/views/ydhy/groupProfile/readingMession/pieChart'),
            name: 'ReadingMession',
            meta: { title: '班级用户阅读任务' }
          },
          {
            path: 'interestStatistics',
            component: () => import('@/views/ydhy/groupProfile/interestStatistics/areaChart'),
            name: 'InterestStatistics',
            meta: { title: '班级阅读兴趣统计' }

          },
          {
            path: 'linearRegmession',
            component: () => import('@/views/ydhy/groupProfile/linearRegmession/linear'),
            name: 'LinearRegmession',
            meta: { title: '学校阅读兴趣统计' }
          }
        ]
      },
      {
        path: 'personalReadingProf',
        component: () => import('@/views/ydhy/personalProfile/index'), // Parent router-view
        name: 'personalReadingProf',
        meta: { title: '学生阅读数据', icon: 'person' },
        children: [
          {
            path: 'readingCount',
            name: 'readingCount',
            meta: { title: '阅读兴趣统计' },
            component: () => import('@/views/ydhy/personalProfile/readingCount')
          },
          {
            path: 'readingTend',
            name: 'readingTend',
            meta: { title: '阅读兴趣趋势' },
            component: () => import('@/views/ydhy/personalProfile/readingTend')
          },
          {
            path: 'readingTaskCount',
            name: 'readingTaskCount',
            meta: { title: '阅读任务执行情况' },
            component: () => import('@/views/ydhy/personalProfile/readingTaskCount')
          }
        ]
      }
    ]
  },

  // 系统相关数据
  {
    path: '/systemData',
    component: Layout,
    redirect: '/systemData/accessDevicesData',
    name: 'systemData',
    meta: { title: '系统相关数据', icon: 'histogram' },
    children: [
      {
        path: 'accessDevicesData',
        name: 'AccessDevicesData',
        component: () => import('@/views/systemData/accessDevicesData/index'),
        meta: { title: '系统访问设备统计', icon: 'devices' }
      },
      {
        path: 'accessAreaData',
        name: 'AccessAreaData',
        component: () => import('@/views/systemData/accessAreaData'),
        meta: { title: '用户访问区域统计', icon: 'international' }
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
        meta: { title: '每日时段访问统计', icon: 'time' }
      }
    ]
  },

  // *人员管理
  {
    path: '/administration',
    component: Layout,
    meta: { title: '人员管理', icon: 'member' },
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
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // 需要服务器支持
  base: process.env.NODE_ENV === 'production' ? '/admin/' : '/', // 部署到Tomcat必须写
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
