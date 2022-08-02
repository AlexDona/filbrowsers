/**
 * Created by lyx on 2022/3/19.
 */
import web3 from 'web3'
import i18n from '@/assets/i18n/config'

const utils = {
  // 字符串中间显示省略号
  centerEllipsis(str, num = 8) {
    if (str) {
      // 字符串长度不够则不处理
      if (str.length > num*2) {
        const firstStr = str.substr(0, num)
        const lastStr = str.substr(-num, num)
        return firstStr + '...' + lastStr
      } else {
        return str
      }
    }
  },
  fromWei(str, type = 'ether', num = 2) {
    if (str) return this.forMatNumber(web3.utils.fromWei(str, type), num)
  },
  // 保留N位小数并去掉末尾的0
  forMatNumber(num, len) {
    let str = Number(num).toFixed(len);
    if (!str) return '0';
    if (!(/^[+-]?[\d]+([.][\d]+)?([Ee][+-]?[\d]+)?$/g.test(str))) return '0';
    while (str.includes(".") && (str.endsWith('.') || str.endsWith('0'))) {
      str = str.slice(0, -1)
    }
    return str
  },
  // 除法
  exc(val, valTwo) {
    const strVal = val.toString()
    const strValTwo = valTwo.toString()
    const index = strVal.indexOf('.')
    const indexTwo = strValTwo.indexOf('.')
    const num = [0, 0]
    if (index > -1) {
      num[0] = strVal.length - 1 - index
    }
    if (indexTwo > -1) {
      num[1] = strValTwo.length - 1 - index
    }
    return Math.round(val * Math.pow(10, num[0])) / (Math.round((valTwo * Math.pow(10, num[1]))) * Math.pow(10, num[0] - num[1]))
  },
  // 设置进度条数值
  setNumber(num, index, first) {
    if (index === 0 && num === first) {
      return 100
    } else {
      return utils.exc(num, first)*100
    }
  },
  /**
     * byte单位转换
     * @param item [String] 需转换的byte
     * @param len [Number]  需保留的小数位
     * @param number   [Number]  指定的单位，数值与下方sizes数组相同, 如未指定单位则按最高单位返回
     * @param showUnit [Boolen]  是否需要返回单位字符
     * @returns {string|number}
     */
  unitConversion(item, len, number, showUnit = true) {
    let positive = true
    const unit = 1024
    let sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB'
    ]
    if (item == 0) {
      return !number? '0 Bytes':`0 ${sizes[number]}`
    }
    if (item < 0) {
      positive = false
      item = Math.abs(item)
    }
    let num = Math.floor(Math.log(item) / Math.log(unit))
    if (num < 0) {
      item = 0
    } else {
      let str = showUnit? ' ' + sizes[!number? num:number]: ''
      item = (item / Math.pow(unit, !number? num:number)).toFixed(len) + str
    }
    return positive ? item : `-${item}`
  },
  /**
     * 获取两个时间之间的间隔
     * @param from 第一个时间戳
     * @param to   第二个时间戳，不传默认当前时间
     * @param ago  是否显示文字‘之前’
     * @returns {string|*}
     */
  formatTime(from, to, ago = true) {

    // to为空则获取当前时间
    const current = new Date(to || new Date()).getTime()
    let interval = Math.abs(current - from * 1000) / 1000
    const isEn = i18n.locale === 'en'
    const secUnit = 1
    const minUnit = 60
    const hrUnit = 60 * 60
    const dayUnit = 24 * hrUnit
    const arr = []
    const unit = [dayUnit, hrUnit, minUnit, secUnit]
    const suffix = i18n.t('formatTime.suffix')
    let n = 0
    while (n < 4) {
      arr.push(Math.floor(interval / unit[n]))
      interval = interval - unit[n] * arr[n]
      n++
    }
    const strMap = arr
      .map((item, index) => {
        return `${item}${suffix[index]}${item > 1 && index !== 3 ? (isEn ? '' : '') : ''}`
      })
      .filter((item) => {
        return item[0] !== '0'
      })
      .slice(0, 2)
    return strMap.join(' ').length ? strMap.join(' ') + (ago ? ' ' + (i18n.t('formatTime.before')) : '') : i18n.t('formatTime.justNow')
    // return strMap.join(' ') + (ago ? ('') : '')
  },
  //数字每三位加逗号
  formatNum(num, wei = 1) {
    if (!num) return ''
    num = num / wei
    num = num + ''
    const reg = /(?=(\B)(\d{3})+$)/g
    if (num.indexOf('.') > -1) {
      const period = num.split('.')
      const integer = period[0]
      const decimal = period[1]
      const res = integer.replace(reg, ',')
     
      return res +'.'+ decimal
    } else {
      return num.replace(reg, ',')
    }
  }
}

export default utils
