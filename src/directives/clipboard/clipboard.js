// Inspired by https://github.com/Inndy/vue-clipboard
// const Clipboard = require('clipboard')
// if (!Clipboard) {
//   throw new Error('you should npm install `clipboard` --save at first ')
// }

export default {
  bind(el, binding) {
    el.handler = (e) => {
      let clipboardData = e.clipboardData || window.clipboardData
      if(!clipboardData) return
      let text = window.getSelection().toString()
      if(text) {
        e.preventDefault();
        // use clipboardData method setData(format,data) set data
        // format to DOMString type
        clipboardData.setData('text/plain', binding.value)
      }
    }
    el.addEventListener('copy', el.handler);
  },
  update(el, binding) {
  },
  unbind(el, binding) {
    el.removeEventListener('copy', el.handler)
  }
}
