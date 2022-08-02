/**
 * @name: index
 * @author: Administrator
 * @date: 2022/5/24 16:15
 * @description：index
 * @update: 2022/5/24 16:15
 */

import copy from './clipboard'
// 自定义指令
const directives = {
  copy
}
// 这种写法可以批量注册指令
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
