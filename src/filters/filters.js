/**
 * @name: filters
 * @author: Administrator
 * @date: 2022/5/18 9:22
 * @description：filters
 * @update: 2022/5/18 9:22
 */

/**
 *
 * @param value
 * @returns {string}
 */

let handleNullDatas = (value) => {
  const types = Object.prototype.toString.call(value).slice(8, -1)
  if (value) {
    if (['Undefined', 'Null'].includes(types) ) {
      return 'N/A'
    } else if (types === 'String'){
      if (value.split(' ').includes('NaN')) {
        return 'N/A'
      } else {
        return value
      }
    } else {
      return value
    }
  } else {
    return 'N/A'
  }
}
export default {
  handleNullDatas
}