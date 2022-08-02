<template>
  <div class="belong container" v-loading="loading">
    <!-- 账户 -->
    <div class="w-full hide-mini">
      <div class="mt-1 top-title">账户 {{ $route.params.accountId }}</div>
      <div class="main mt-1">
        <el-card class="box-card">
          <div slot="header">账户概览</div>
          <dl class="region-row">
            <dt class="region-key">地址</dt>
            <dd class="region-value">
              {{ messageConfig.address }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">ID</dt>
            <dd class="region-value">
              {{ messageConfig.id }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">类型</dt>
            <dd class="region-value">
              {{ convertType(messageConfig.actor) }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">余额</dt>
            <dd class="region-value">
              {{ $utils.fromWei(messageConfig.balance, "ether", 18) }} FIL
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">消息数</dt>
            <dd class="region-value">{{ messageConfig.messageCount }}</dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">创建时间</dt>
            <dd class="region-value">
              {{
                $moment(Number(messageConfig.createTimestamp) * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">最新交易</dt>
            <dd class="region-value">
              {{
                $moment(Number(messageConfig.lastSeenTimestamp) * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </dd>
          </dl>
          <dl
            class="region-row"
            v-if="
              messageConfig.ownedMiners && messageConfig.ownedMiners.length > 0
            "
          >
            <dt class="region-key">名下存储提供者</dt>
            <dd class="region-value worker">
              <a
                v-for="item in messageConfig.ownedMiners"
                :key="item"
                class="bright-color hover-color line-one"
                @click="goPage('address', item)"
              >
                {{ item }}
              </a>
            </dd>
          </dl>
          <dl
            class="region-row"
            v-if="
              messageConfig.workerMiners &&
              messageConfig.workerMiners.length > 0
            "
          >
            <dt class="region-key">实际工作存储提供者</dt>
            <dd class="region-value worker">
              <a
                v-for="item in messageConfig.workerMiners"
                :key="item"
                class="bright-color hover-color line-one"
                @click="goPage('address', item)"
              >
                {{ item }}
              </a>
            </dd>
          </dl>
        </el-card>
      </div>
    </div>
    <!--h5端-->
    <div class="show-mini mini-list">
      <el-card class="box-card">
        <div slot="header">
          <div class="sub-title">账户概览</div>
        </div>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">地址</dt>
          <dd class="region-value line-one">
            {{ messageConfig.address }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">ID</dt>
          <dd class="cp region-value">
            {{ messageConfig.id }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">类型</dt>
          <dd class="cp region-value">
            {{ convertType(messageConfig.actor) }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">余额</dt>
          <dd class="cp region-value">
            {{ $utils.fromWei(messageConfig.balance, "ether", 18) }} FIL
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">消息数</dt>
          <dd class="cp region-value">
            {{ messageConfig.messageCount }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">创建时间</dt>
          <dd class="region-value">
            {{
              $moment(Number(messageConfig.createTimestamp) * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">最新交易</dt>
          <dd class="cp region-value">
            {{
              $moment(Number(messageConfig.lastSeenTimestamp) * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            }}
          </dd>
        </dl>
        <dl
          class="item region-row text-mini flex justify-between"
          v-if="
            messageConfig.ownedMiners && messageConfig.ownedMiners.length > 0
          "
        >
          <dt class="region-key">名下存储提供者</dt>
          <dd class="cp region-value worker">
            <a
              v-for="item in messageConfig.ownedMiners"
              :key="item"
              class="cp bright-color hover-color line-one"
              @click="goPage('address', item)"
            >
              {{ item }}
            </a>
          </dd>
        </dl>
        <dl class="item region-row text-mini flex justify-between">
          <dt class="region-key">实际工作存储提供者</dt>
          <dd class="cp region-value worker">
            <a
              v-for="item in messageConfig.workerMiners"
              :key="item"
              class="cp bright-color hover-color line-one"
              @click="goPage('address', item)"
            >
              {{ item }}
            </a>
          </dd>
        </dl>
      </el-card>
    </div>
    <div>
      <Changes />
    </div>
    <Block :tabList="tabList" tabChoose="message" />
  </div>
</template>
<script>
import { getDatas } from "@/utils/method"
import { fetchAccountDetail } from "@/api/common"
import Changes from "./changes.vue"
import Block from "./index.vue"
export default {
  components: {
    Changes,
    Block,
  },
  data() {
    return {
      params: {
        page: 1,
        page_size: 20,
        method: "",
      },
      messageLoading: false,
      messageInfo: [],
      totalMessage: "",
      loading: false,
      otherInfo: [],
      messageConfig: {},
      dataList: [],
      selectData: [],
      tabList: Object.freeze([
        { label: "消息列表", value: "message" },
        { label: "转帐列表", value: "transfer" },
      ]),
    }
  },
  computed: {
    // 账户类型
    convertType() {
      return function (type) {
        const typeTxt = {
          account: "普通账户",
          storageminer: "存储提供者账户",
          multisig: '多重签名'
        }
        return typeTxt[type]
      }
    },
  },
  mounted() {
    this.getLists()
  },
  watch: {
    "$route.params.belongId": {
      handler(newVal, oldValue) {
        this.getLists()
      },
    },
  },
  methods: {
    // 获取消息详情
    getLists() {
      getDatas
        .call(
          this,
          fetchAccountDetail({
            account: this.$route.params.accountId,
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            const result = res.data
            this.messageConfig = res.data
          }
        })
    },
    goPage(name, id) {
      this.$router.push({ path: `/${name}/${id}` })
    },
  },
}
</script>
<style scoped lang="scss">
.main {
  margin-bottom: 1rem;
}
.belong {
  .el-table {
    min-height: auto;
  }
  .show-mini {
    .line-one {
      margin-top: 0.25rem;
    }
  }
  .worker {
    flex-direction: row;
    justify-content: flex-start;
    .line-one {
      margin-right: 1rem;
    }
  }
}
</style>
