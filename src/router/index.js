import Vue from 'vue'
import VueRouter from "vue-router"
import routes from './routes'
import i18n from '@/assets/i18n/config'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/',
  linkActiveClass: 'router-active',
  routes,
  //页面跳转显示在顶部
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) { // todo: 设置有锚点时平滑滚动
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      window.document.body.scrollTo(0,0)
    }
  }
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + '-区块浏览器'
    const data = localStorage.getItem('vuex')
    if (data && JSON.parse(data).modules.locale) {
      i18n.locale = JSON.parse(localStorage.getItem('vuex')).modules.locale
    }
    // document.title = i18n.t(to.meta.title)
  }
  next()
})

// 避免点击重复路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
