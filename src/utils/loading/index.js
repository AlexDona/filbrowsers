/**
 * Created by lyx
 */
import ElementUI from 'element-ui'
import { config } from './config'

let loading = null
const show = (el) => {
  // 避免loading实例被重复创建
  if (loading) {
    loading.close()
  }
  loading = ElementUI.Loading.service(config(el))
}

const hide = () => {
  loading.close()
}

const loadingObj={
  show,
  hide
}

export default loadingObj
