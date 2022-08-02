<template>
  <div id="app">
      <router-view  v-if="routerAlive"></router-view>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data() {
    return {
      routerAlive: true
    }
  },
  provide(){    //在父组件中创建属性
    return {
      routerRefresh: this.routerRefresh
    }
  },
  computed: {
    ...mapState({
      'lg': state => state.modules.lg,
      'xs': state => state.modules.xs
    })
  },
  created() {
    const screen = {
      small: 640,
      medium: 768,
      large: 1024
    }
    // console.log(resizeHandler(screen.large), resizeHandler(screen.small), 'bg')
    this.setLg(resizeHandler(screen.large))
    this.setXs(resizeHandler(screen.small))

    let throttle
    window.addEventListener('resize', (e) => {
      this.setLg(resizeHandler(screen.large))
      this.setXs(resizeHandler(screen.small))
      throttle = throttle || setTimeout(() => {
        throttle = null
      }, 200)
    })

    // calculate big and small size
    function resizeHandler(screenWidth) {
      // get window width
      const iw = window.innerWidth
      switch(screenWidth) {
        case 640: return iw <= screenWidth
        case 1024: return iw > 640
        default:
          return true
      }
      // determine named
      // return iw >= screenWidth
    }
  },
  methods: {
    ...mapMutations(['setLg', 'setXs']),
    routerRefresh() {
      this.routerAlive = false
      this.$nextTick(()=>{
        this.routerAlive = true
      })
    }
  }
}
</script>
<style lang="scss">

</style>
