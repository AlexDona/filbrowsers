<template>
  <div class="blockhigh container" v-loading="loading">
    <!-- 区块高度 -->
    <div class="w-full hide-mini">
      <div class="mt-1 top-title">区块高度#{{ $route.params.blockhigh }}</div>
      <div class="main mt-1">
        <el-card class="box-card">
          <div slot="header">
            <dl class="region-row">
              <dt class="region-key">区块时间</dt>
              <dd class="region-value">
                {{
                  $moment(Number(blockInfo.timestamp) * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </dd>
            </dl>
            <dl class="region-row">
              <dt class="region-key">累计消息数（去重）</dt>
              <dd class="region-value">
                {{ blockInfo.messageCount }}
              </dd>
            </dl>
          </div>

          <div class="high-title">所有区块</div>
          <div
            v-for="(item, index) in blockInfo.blocks"
            :key="index"
            class="high-item"
          >
            <dl class="region-row">
              <dt class="region-key">区块ID</dt>
              <dd
                class="cp region-value bright-color hover-color"
                @click="goPage('belong', item.cid)"
              >
                {{ item.cid }}
              </dd>
            </dl>
            <dl class="region-row">
              <dt class="region-key">存储提供者</dt>
              <dd
                class="cp region-value bright-color hover-color"
                @click="goPage('address', item.miner)"
              >
                {{ item.miner }}
              </dd>
            </dl>
            <dl class="region-row">
              <dt class="region-key">奖励</dt>
              <dd class="region-value">
                {{ $utils.fromWei(item.reward, "ether", 18) }} FIL
              </dd>
            </dl>
            <dl class="region-row">
              <dt class="region-key">消息数</dt>
              <dd class="region-value">
                {{ item.messageCount }}
              </dd>
            </dl>
          </div>
        </el-card>
      </div>
    </div>

    <!--h5端-->
    <div class="show-mini mini-list">
      <div class="title">
        <div class="region-one">
          <div class="text">区块高度</div>
          <div class="high-id">#{{ $route.params.blockhigh }}</div>
        </div>
        <div class="region-two">
          <dl class="region-row">
            <dt class="region-key">区块时间</dt>
            <dd class="region-value">
              {{
                $moment(Number(blockInfo.timestamp) * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">累计消息数（去重）</dt>
            <dd class="region-value">
              {{ blockInfo.messageCount }}
            </dd>
          </dl>
        </div>
      </div>

      <el-card class="box-card">
        <div slot="header">
          <div class="sub-title">所有区块</div>
        </div>
        <div
          class="rows"
          v-for="(item, index) in blockInfo.blocks"
          :key="index"
        >
          <div class="item text-mini flex justify-between">
            <div class="name black-color">区块ID</div>
            <div class="cp">
              <span class="line-one"> {{ item.cid }}</span>
            </div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name black-color">存储提供者</div>
            <div
              class="cp bright-color hover-color"
              @click="goPage('address', item.miner)"
            >
              {{ item.miner }}
            </div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name black-color">奖励</div>
            <div class="cp">
              {{ $utils.fromWei(item.reward, "ether", 18) }} FIL
            </div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name black-color">消息数</div>
            <div class="cp">
              {{ item.messageCount }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getDatas } from "@/utils/method"
import { fetchBlockDetail } from "@/api/common"
import Block from "@/views/block/index"
import { convertStatus, convertType } from "./blockMix"
export default {
  components: {
    // Block,
  },
  props: {
    accountId: {
      type: String,
      default: "f049911",
    },
  },
  data() {
    return {
      loading: false,
      blockInfo: [],
      otherInfo: [],
      messageConfig: {},
    }
  },
  computed: {},
  mounted() {
    this.getLists()
  },
  methods: {
    // 获取消息详情
    getLists() {
      getDatas
        .call(
          this,
          fetchBlockDetail({
            blockhigh: this.$route.params.blockhigh,
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            this.blockInfo = res.data
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
.high-item {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: #f0f6fb;
  margin: 0 2rem 1rem 2rem;
  border-radius: 0.375rem;
}
.high-title {
  margin: 1rem 0 1rem 2rem;
}
.show-mini {
  .title {
    .text {
      margin: 0.5rem 0 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .high-id {
      margin: 0.5rem 0 0.5rem 1rem;
      font-size: 0.75rem;
    }
    background-color: #fff;
    .region-one {
      border-bottom: 1px solid #f0f6fb;
    }
  }
  .box-card {
    // .sub-title {
    //   font-size: 0.875rem;
    //   font-weight: 500;
    // }
    .name {
      width: 30%;
    }
    // .line-one {
    //   line-height: 1rem;
    //   display: inline-block;
    // }
  }
  .cp {
    word-break: break-all;
    text-align: right;
  }
}
</style>
