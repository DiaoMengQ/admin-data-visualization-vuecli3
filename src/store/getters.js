/**
 * store 中的计算属性（computed）
 * getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
 * 
 * Getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的
 * 不可使用例如store.getters.attribute('value')的方法修改属性值，因为 attribute 并不是一个函数，它仅仅只是一个属性而已
 * 因此将属性转成一个函数
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userid: state => state.user.id
}
export default getters
