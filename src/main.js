import Vue from 'vue'
import Directives from './directives'
import ElementUI from 'element-ui'
import moment from 'moment'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/variables.scss'
import '@/style/index.scss'
import '@/style/style.scss'
import '@/style/reset.scss'
import '@/style/media.scss'
import XEUils from 'xe-utils'
import App from './App.vue'
import router from './router'
import store from './store'
import message from './utils/message'
import Components from './components'
import utils from './utils/common'
import VeLine from 'v-charts/lib/line.common'
import web3 from 'web3'
import i18nMsg from '@/assets/i18n/langs/index'
import locale from 'element-ui/lib/locale'
import filters from './filters/filters.js'


Vue.use(Directives)
Vue.use(ElementUI)
Vue.use(Components)

Vue.component(VeLine.name, VeLine)

const i18n = new VueI18n({
  locale: store.state.modules.locale || 'zh-hans',
  messages: {
    'zh-hans': i18nMsg['zh-hans'],
    'en': i18nMsg.en,
  },
  silentTranslationWarn: true
})

locale.i18n((key, value) => i18n.t(key, value))

for (let value in filters) {
  // value是filter名称（字符串）
  // filters[value] 对象里面的某个元素，就是filters中定义的方法
  Vue.filter(value, filters[value])
}

// 注入到根实列中
Vue.prototype.$XEUils = XEUils
Vue.prototype.$moment = moment
Vue.prototype.$web3 = web3
Vue.prototype.$utils = utils
Vue.prototype.$msg = message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// 加载移动端调试器 eruda
if (process.env.NODE_ENV !== 'production' && window.document.body.clientWidth <= 640) {
  try {
    var s = document.createElement('script')
    s.setAttribute('type', 'text/javascript')
    s.setAttribute('src', 'static/js/eruda.min.js?_v=' + process.env.BUILD_AT)
    s.onload = function() {
      window.eruda.init()
    }
    document.body.appendChild(s)
  } catch (e) {
    console.log(e)
  }
}

console.log(
  `编译于 ${process.env.BUILD_AT} 版本 ${process.env.GIT_VERSION} 运行环境 ${process.env.NODE_ENV} 当前链接 ${
    location.href
  }`,
)