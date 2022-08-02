/**
 * Created by lyx
 */
import { Message } from 'element-ui'

const $msg = (options) => {
  // 创建前先关闭，防止重复创建message
  Message.closeAll()
  Message(options)
}
export default $msg
