/**
 * Created by lyx
 */
// 全局页面跳转是否启用loading
export const routerLoading = false

// 全局api接口调用是否启用loading
export const apiLoading = false

// loading参数配置
export const config = (el = 'body') => {
  return {
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    // loading需要覆盖的DOM节点
    target: document.querySelector(el)
  }
}
