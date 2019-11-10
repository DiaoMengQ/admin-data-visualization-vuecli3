import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 组件注册
// 此处为全局可复用的组件
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
