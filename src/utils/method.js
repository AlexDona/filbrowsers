/**
 * Created by lyx on 2022/3/23.
 */
import message from './message/index'

/**
 * 通用获取数据
 * @param fetch   [Function] api方法
 * @param loading [String]   loading字段名
 * @param _code   [String]   成功状态码
 * @returns {Promise<unknown>}
 */
export function getDatas (fetch, loading, _code = 200) {
  return new Promise((resolve, reject) => {
    if (loading) {
      this[loading] = true
    }
    fetch.then(res => {
      if (loading) {
        this[loading] = false
      }
      const {code} = res
      if (code === _code) {
        if (res) {
          resolve(res)
        }
      } else {
        message({
          message: res.message,
          type: 'error'
        })
        reject(res)
      }
    }).catch(err => {
      if (loading) {
        this[loading] = false
      }
      reject(err)
    })
  })
}

/**
 *
 * @param func
 * @param delay
 */
var timerId
export function throttle(func, delay) {
  // If setTimeout is already scheduled, no need to do anything
  let timerId = null
  if (timerId) return
  timerId = setTimeout(function() {
    func()
    // Once setTimeout function execution is finished, timerId = undefined
    // the next scroll event function execution can be scheduled by the setTime out
    timerId = undefined
  }, delay)
}

export function debounce(func, delay) {
  return function(){
    if(timerId !== null){
      clearTimeout(timerId)
    }
    timerId = setTimeout(func, delay)
  }
  // clearTimeout(timerId)
  // timerId = setTimeout(func, delay);

}