import Layout from '@/layout'

/**
 * 固定的路由
 * 由于登录时会动态增加路由，导致路由选项被修改，在重置路由选项时无法重置
 * 在此设定固定的路由路径，并于index中调用
 * 注意：不能直接暴露变量，否则也会被修改
 */
export function routes() {
  const constantRoutes = [
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
    {
      path: '/qcpj',
      component: Layout,
      meta: { title: '七彩评价', icon: 'qcpj' },
      redirect: '/qcpj/groupProfile/studentsLinear',
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
              path: 'studentsLinear',
              component: () => import('@/views/qcpj/groupProfile/LinearRegression/studentsLiner'),
              name: 'studentsLinear',
              meta: { title: '评价积分趋势' }
            },
            {
              path: 'linearRegression',
              component: () => import('@/views/qcpj/groupProfile/LinearRegression'),
              name: 'LinearRegression',
              meta: { title: 'backup' },
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
          component: () => import('@/views/ydhy/personalProfile/index'),
          redirect: '/ydhy/personalReadingProf/readingCount',
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
    }
  ]

  return constantRoutes
}
