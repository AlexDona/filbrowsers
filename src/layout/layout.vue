<template>
  <div class="flex content">
    <div class="header w-full">
      <div class="container">
        <div class="top justify-between flex">
          <div class="logo cp" @click="goPage('home')">
            <img class="icon" src="../assets/logo.png"/>
          </div>
          <div class="mini-search">
            <el-input
                @keyup.enter.native="handleSerach"
                size="small"
                placeholder="搜索区块/账户/地址/消息..."
                suffix-icon="el-icon-search"
                v-model="search">
            </el-input>
          </div>
          <div class="flex">
            <div class="mini-menu cp" @click="showMiniMenu">
              <img class="menu-icon" src="../assets/icon/menu-mini.svg"/>
            </div>
            <div class="max-right">
              <!--                            <span class="network">当前网络：{{'Mainnet'}}</span>-->
              <img class="icon" src="../assets/icon/language.svg"/>
              <el-dropdown trigger="click" class="cp" @command="setLang" @visible-change="menuExpend4 = !menuExpend4">
                              <span class="el-dropdown-link">
                                {{ langName[locale] }}<i class="el-icon-caret-bottom el-icon--right" :class="{'expand': menuExpend4}"></i>
                              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="zh-hans">中文</el-dropdown-item>
                  <!--                                    <el-dropdown-item command="en">English</el-dropdown-item>-->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="nav clearfix">
          <div class="menu flex fl">
            <div class="item">
              <div @click="goPage('home')">首页</div>
            </div>
            <div class="item">
              <el-dropdown @command="goPage" @visible-change="menuExpend1 = !menuExpend1">
                              <span class="el-dropdown-link">
                                区块链<i class="el-icon-caret-bottom el-icon--right" :class="{'expand': menuExpend1}"></i>
                              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="rich">富豪榜</el-dropdown-item>
                  <el-dropdown-item command="order">订单</el-dropdown-item>
                  <el-dropdown-item command="memoryPool">内存池</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="item">
              <div @click="goPage('ranks')">排行榜</div>
            </div>
            <div class="item">
              <el-dropdown @command="goPage" @visible-change="menuExpend2 = !menuExpend2">
                              <span class="el-dropdown-link">
                                统计<i class="el-icon-caret-bottom el-icon--right" :class="{'expand': menuExpend2}"></i>
                              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="miner">存储服务图表</el-dropdown-item>
                  <el-dropdown-item command="gas">Gas统计</el-dropdown-item>
                  <el-dropdown-item command="solitaryBlock">孤块统计</el-dropdown-item>
                  <el-dropdown-item command="powerLoss">节点算力损失统计</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="item">
              <el-dropdown @command="goPage" @visible-change="menuExpend3 = !menuExpend3">
                              <span class="el-dropdown-link">
                                资源<i class="el-icon-caret-bottom el-icon--right" :class="{'expand': menuExpend3}"></i>
                              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="commonTools">常用工具</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
<!--            <div class="item">-->
<!--              <div @click="goPage('tools')">工具</div>-->
<!--            </div>-->
          </div>
          <div class="search fr xl:w-2/5 lg:w-3/8">
            <el-input
                @keyup.enter.native="handleSerach"
                clearable
                size="small"
                placeholder="搜索区块/账户/地址/消息..."
                suffix-icon="el-icon-search"
                v-model="search">
            </el-input>
          </div>
        </div>
      </div>
      <!-- 小屏幕菜单 -->
      <div class="menu-dialog effect" v-show="showMenu">
        <div class="menu-item" @click="goPage('home')">首页</div>
        <el-collapse accordion class="menu-item">
          <el-collapse-item title="区块链">
            <div class="sub-item" @click="goPage('rich')">富豪榜</div>
            <div class="sub-item" @click="goPage('order')">订单</div>
            <div class="sub-item" @click="goPage('memoryPool')">内存池</div>
          </el-collapse-item>
        </el-collapse>
        <div class="menu-item" @click="goPage('ranks')">排行榜</div>
        <el-collapse accordion class="menu-item">
          <el-collapse-item title="统计">
            <div class="sub-item" @click="goPage('miner')">存储服务图表</div>
            <div class="sub-item" @click="goPage('gas')">Gas统计</div>
            <div class="sub-item" @click="goPage('solitaryBlock')">孤块统计</div>
            <div class="sub-item" @click="goPage('powerLoss')">节点算力损失统计</div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse accordion class="menu-item">
          <el-collapse-item title="资源">
            <div class="sub-item" @click="goPage('commonTools')">常用工具</div>
          </el-collapse-item>
        </el-collapse>
<!--        <div class="menu-item" @click="goPage('tools')">工具</div>-->
        <el-collapse accordion class="menu-item">
          <el-collapse-item title="语言">
            <div class="sub-item" @click="setLang('zh-hans')">中文</div>
<!--            <div class="sub-item" @click="setLang('en')">English</div>-->
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="flex-grow">
      <router-view class='flex-grow' ref="main"></router-view>
    </div>
    <div class="footer">
      <div class="footer-content container">
        <img class="icon" src="../assets/logo.png"/>
        <p class="mt-3/4 text-mini"> FILVIEW是Filecoin区块链浏览器及数据服务平台。为用户稳定地提供Filecoin相关的各类数据、信息和可视化图表等内容。 </p>
      </div>
      <p class="text-center copyright text-mini"> © 2022 FILVIEW All Rights Reserved. </p>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {fetchSearch, qurryAccountDetail} from "@/api/common"
import {getDatas} from "@/utils/method"

export default {
  inject: ['routerRefresh'],   //在子组件中注入在父组件中出创建的属性
  data() {
    return {
      menuExpend1: false, // pc dropdown menu 是否展开
      menuExpend2: false, // pc dropdown menu 是否展开
      menuExpend3: false, // pc dropdown menu 是否展开
      menuExpend4: false, // pc dropdown menu 是否展开
      search: '',
      showMenu: false,
      langName: {
        'zh-hans': '中文',
        'en': 'English'
      },
    }
  },
  computed: {
    ...mapState({
      locale: state => state.modules.locale,
    })
  },
  mounted() {
  },
  methods: {
    handleSerach() {
      const searchText = this.search.trim()
      getDatas.call(this, fetchSearch({account: searchText}), 'loading').then(res => {
        if (res.data) {
          switch (res.data.type) {
            case 'address':
              getDatas.call(this, qurryAccountDetail({account: searchText})).then(res => {
                if (res.data) {
                  if (res.data.actor === 'account' || res.data.actor === 'multisig') {
                    this.$router.push({path: `/account/${this.search}`})
                    if (this.$route.name === 'account') this.routerRefresh() // 防止页面不刷新
                  } else {
                    this.$router.push({path: `/address/${this.search}`})
                    if (this.$route.name === 'address') this.routerRefresh() // 防止页面不刷新
                  }
                }
              })
              break
            case 'block':
              this.$router.push({path: `/belong/${this.search}`})
              break
            case 'tipset':
              this.$router.push({path: `/height/${this.search}`})
              if (this.$route.name === 'bHeight') this.routerRefresh() // 防止页面不刷新
              break
            case 'message':
              this.$router.push({path: `/message/${this.search}`})
              if (this.$route.name === 'message') this.routerRefresh() // 防止页面不刷新
              break
          }
        } else {
          this.$message.error('无法搜到此内容')
        }
      })
      console.log(this.search, 'nice')
    },
    setLang(lang) {
      // this.$store.dispatch('locale', lang)
      // this.$i18n.locale = lang;
      // document.title = this.$i18n.t(this.$route.meta.title)
    },
    showMiniMenu() {
      this.showMenu = !this.showMenu
    },
    goPage(name) {
      this.showMenu = false
      this.$router.push({name})
    }
  },
}
</script>
<style scoped lang="scss">
.content {
  flex-direction: column;
  height: 100%;
  .expand {
    transform: rotate(-180deg);
    transition: transform 0.15s ease-in;
  }
}

.footer {
  padding: 20px;
  font-size: 14px;
  color: #fff;
  background-color: #0A1035FF;
  .footer-content {
    padding-bottom: 1.88rem;
    .icon {
      height: 2rem;
    }
  }
  .copyright {
    color: #FFFFFF4D;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
