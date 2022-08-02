<template>
  <div class="commonTools container">
    <el-card class="box-card mt-1">
      <div slot="header" class="title-bar">
        官方社区
      </div>
      <div class="grid gap-2 my-1/2" :class="{'grid-cols-4': lg, 'grid-cols-2': xs}">
        <a href="https://filecoin.io/blog/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 官方博客 </a>
        <a href="https://app.slack.com/client/TEHTVS1L6/CEHTVSEG6/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Slack 频道 </a>
        <a href="https://twitter.com/Filecoin" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 官方推特 </a>
        <a href="https://discuss.filecoin.io/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 官方论坛 </a>
      </div>
    </el-card>
    <el-card class="box-card mt-1">
      <div slot="header" class="title-bar">
        常用链接
      </div>
      <div class="grid gap-2 my-1/2" :class="{'grid-cols-4': lg, 'grid-cols-2': xs}">
        <a href="https://filecoin.io/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 官网 </a>
        <a href="https://github.com/filecoin-project/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Github </a>
        <a href="https://filfox.info/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Filfox 浏览器 </a>
        <a href="https://docs.filecoin.io/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Filecoin 文档 </a>
        <a href="https://ignite.fil.events/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Filecoin Ignite </a>
        <a href="https://app.instagantt.com/shared/s/1152992274307505/latest" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 路线图 </a>
      </div>
    </el-card>
    <el-card class="box-card mt-1 mb-1">
      <div slot="header" class="title-bar">
        开发工具
      </div>
      <div class="grid gap-2 my-1/2" :class="{'grid-cols-4': lg, 'grid-cols-2': xs}">
        <a href="https://go.filecoin.io/go-filecoin-tutorial/Home.html" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> go-filecoin 测试网教程 </a>
        <a href="https://lotu.sh/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Lotus 测试网教程 </a>
        <a href="https://lotu.sh/en+hardware-mining" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Lotus 性能测试工具 </a>
        <a href="https://github.com/filecoin-project/devgrants#submit-a-proposal-for-open-grants" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> Grants 信息 </a>
        <a href="https://proto.school/#/tutorials" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 协议学院教程 </a>
        <a href="https://blog.textile.io/" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> DApp 工具 </a>
        <a href="https://pcpartpicker.com/user/tperson/saved/H2BskL" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 官方测试环境集群（小规模） </a>
        <a href="https://filecoin.io/vintage/mining-hardware-config-testnet-v1.pdf" class="text-center py-1/2 hover-color my-auto" :class="{'text-xs': xs, 'text-sm': lg}"> 官方测试环境集群（大规模） </a>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "commonTools",
  data() {
    return {}
  },
  mounted() {
    console.log(this.lg, this.xs, 'lg xs')
  },
  computed: {
    ...mapState({
      lg: state => state.modules.lg,
      xs: state => state.modules.xs
    })
  },
}
</script>

<style scoped>

</style>