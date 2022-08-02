/**
 * Created by lyx on 2022/3/23.
 */
import axios from 'axios'
import message from '@/utils/message'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  // api域名
  baseURL: process.env.VUE_APP_API_URL,
  // 跨域请求时发送cookie
  // withCredentials: true,
  // 请求超时时间
  timeout: 100000000
})

// 判断元素类型JS
function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/**
 * 去除字符串前后空格，去除值为null的参数
 * @param params 参数
 * @returns {*}
 */
function filterNull(params) {
  for (let key in params) {
    if (params[key] === null) {
      delete params[key]
    }
    if (toType(params[key]) === 'string') {
      params[key] = params[key].trim()
    } else if (toType(params[key]) === 'object') {
      params[key] = filterNull(params[key])
    } else if (toType(params[key]) === 'array') {
      params[key] = filterNull(params[key])
    }
  }
  return params
}
// request 拦截器
service.interceptors.request.use(
  config => {
    // 请求之前的操作
    // if (store.getters.token) {
    //     // token添加到请求头
    //     config.headers.token =' Bearer ' + getToken()
    // }
    const {method} = config
    if (method.toLowerCase() === 'post') {
      // config.headers['content-type'] = 'application/json'
      // let param = new FormData() //创建form对象
      // let params = config.data
      // Object.keys(params || {}).forEach(key => {
      //   if (params[key] === null) {
      //     param.append(key, '') //通过append向form对象添加数据
      //   } else if (typeof params[key] === 'object') {
      //     if (params[key].length > 0) {
      //       for (let i = 0; i < params[key].length; i++) {
      //         param.append(key, params[key][i])
      //       }
      //     } else {
      //       param.append(key, params[key])
      //     }
      //   } else {
      //     param.append(key, params[key]) //通过append向form对象添加数据
      //   }
      // })
      config.data = filterNull(config.data)
    } else if (method.toLowerCase() === 'get') {
      config.params = filterNull(config.params)
    } else {
      config.data = filterNull(config.data)
    }
    return config
  },
  error => {
    // 错误处理
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  // 如果想获取http信息（例如标题或状态），需return response
  response => {
    const res = response.data
    if (res.code === 403 || res.code === 401) {
      // message({
      //     message: '登录失效或无权限',
      //     type: 'error',
      //     duration: 3000
      // })
      // setTimeout(function () {
      //     store.dispatch('user/resetToken').then(() => {
      //         location.reload()
      //     })
      // }, 300)
      // return Promise.reject(new Error(res.msg))
    } else {
      return res
    }
  }, (error) => {
    message({
      message: error,
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)
export default service
