import Clipboard from './clipboard'

const install = function(Vue) {
  Vue.directive('copy', Clipboard)
}

Clipboard.install = install
export default Clipboard
