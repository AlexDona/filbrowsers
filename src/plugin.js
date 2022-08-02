/**
 * @name: plugin
 * @author: Administrator
 * @date: 2022/5/20 14:58
 * @description：plugin
 * @update: 2022/5/20 14:58
 */

exports.install = function (Vue, options) {
  const screen = {
    small: 640,
    medium: 768,
    large: 1024
  }
  function getScreen (screen) {







    // calculate size
    function resizeHandler(screen) {

      // get window width
      const iw = window.innerWidth;

      // determine named size
      return iw >= screen
    }

    return resizeHandler()
  }
  Vue.prototype.isLG = function (val){
    return getScreen(screen.large)
  }
}
