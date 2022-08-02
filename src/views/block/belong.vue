<template>
  <div class="belong container" v-loading="loading">
    <!-- 区块详情 -->
    <div class="w-full hide-mini">
      <div class="mt-1 top-title">区块详情</div>
      <div class="main mt-1">
        <el-card class="box-card">
          <div slot="header">区块概览</div>
          <dl class="region-row">
            <dt class="region-key">区块ID</dt>
            <dd class="region-value">
              {{ messageConfig.cid }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">高度</dt>
            <dd
              class="cp region-value bright-color"
              @click="goPage('height', messageConfig.height)"
            >
              {{ messageConfig.height }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">存储提供者</dt>
            <dd
              class="cp region-value bright-color"
              @click="goPage('address', messageConfig.miner)"
            >
              {{ messageConfig.miner }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">时间</dt>
            <dd class="region-value">
              {{
                $moment(Number(messageConfig.timestamp) * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">大小</dt>
            <dd class="cp region-value">{{ messageConfig.size }} Bytes</dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">消息</dt>
            <dd class="cp region-value">
              {{ messageConfig.messageCount }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">奖励</dt>
            <dd class="region-value">
              {{ $utils.fromWei(messageConfig.reward, "ether", 18) }} FIL
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">份数</dt>
            <dd class="region-value">
              {{ messageConfig.winCount }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">父区块</dt>
            <dd class="cp region-value">
              <a
                v-for="item in messageConfig.parents"
                :key="item"
                class="bright-color hover-color"
                @click="goPage('belong', item)"
              >
                {{ item }}
              </a>
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">父区块权重</dt>
            <dd class="region-value">
              {{ $utils.formatNum(messageConfig.parentWeight) }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">罚金</dt>
            <dd class="region-value">
              {{ $utils.fromWei(messageConfig.penalty, "ether", 18) }} FIL
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">Parent Base Fee</dt>
            <dd class="region-value">
              {{ $utils.formatNum(messageConfig.parentBaseFee, 1000000000) }}
              naoFIL
            </dd>
          </dl>
        </el-card>
      </div>
      <div class="main mt-1" v-loading="messageLoading">
        <el-card class="box-card">
          <div slot="header">
            <div>消息列表</div>
            <div class="title-bar flex">
              <span class="content-title">共 {{ totalMessage }} 消息</span>
              <el-select
                :popper-append-to-body="false"
                @change="fnSelectItem"
                v-model="params.method"
                size="mini"
                placeholder="请选择"
              >
                <el-option value="" label="全部">全部</el-option>
                <el-option v-for="item in selectData" :value="item" :key="item">
                  {{ item }}
                </el-option
                >
              </el-select>
            </div>
          </div>
          <el-table class="w-full hide-mini" :data="dataList">
            <el-table-column align="center" label="消息ID">
              <template slot-scope="{ row }">
                <span
                  class="cp hover-color"
                  :title="row.messageid"
                  @click="goPage('message', row.messageid)"
                >{{ $utils.centerEllipsis(row.messageid) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="发送方">
              <template slot-scope="{ row }">
                <span
                  class="cp hover-color"
                  :title="row.to"
                  @click="goPage('account', row.from)"
                >{{ $utils.centerEllipsis(row.from) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="接收方">
              <template slot-scope="{ row }">
                <span
                  class="cp hover-color"
                  :title="row.to"
                  @click="goPage('address', row.from)"
                >
                  {{ $utils.centerEllipsis(row.to) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="方法">
              <template slot-scope="{ row }">
                {{ row.method }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="金额">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.amount, "ether", 18) }}FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="{ row }">
                {{ transformStatus(row.status) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <!--h5端-->
    <div class="show-mini mini-list">
      <div class="mini-card">
        <div class="sub-title border-bottom">区块详情</div>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">区块ID</dt>
          <dd class="region-value line-one">
            {{ messageConfig.cid }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">高度</dt>
          <dd
            class="cp region-value bright-color"
            @click="goPage('height', messageConfig.height)"
          >
            {{ messageConfig.height }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">存储提供者</dt>
          <dd
            class="cp region-value bright-color"
            @click="goPage('address', messageConfig.miner)"
          >
            {{ messageConfig.miner }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">时间</dt>
          <dd class="region-value">
            {{
              $moment(Number(messageConfig.timestamp) * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">大小</dt>
          <dd class="cp region-value">{{ messageConfig.size }} Bytes</dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">消息</dt>
          <dd class="cp region-value">
            {{ messageConfig.messageCount }}
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">奖励</dt>
          <dd class="region-value">
            {{ $utils.fromWei(messageConfig.reward, "ether", 18) }} FIL
          </dd>
        </dl>
        <dl class="item region-row text-mini flex justify-between">
          <dt class="region-key">份数</dt>
          <dd class="region-value">
            {{ messageConfig.winCount }}
          </dd>
        </dl>
        <dl class="item region-row text-mini flex justify-between">
          <dt class="region-key">父区块</dt>
          <dd class="cp region-value">
            <a
              v-for="item in messageConfig.parents"
              :key="item"
              class="bright-color hover-color line-one"
              @click="goPage('belong', item)"
            >
              {{ item }}
            </a>
          </dd>
        </dl>
        <dl class="region-row text-mini flex justify-between">
          <dt class="region-key">父区块权重</dt>
          <dd class="region-value">
            {{ $utils.formatNum(messageConfig.parentWeight) }}
          </dd>
        </dl>
        <dl class="item region-row text-mini flex justify-between">
          <dt class="region-key">罚金</dt>
          <dd class="region-value">
            {{ $utils.fromWei(messageConfig.penalty, "ether", 18) }}FIL
          </dd>
        </dl>
        <dl class="item region-row text-mini flex justify-between">
          <dt class="region-key">Parent Base Fee</dt>
          <dd class="region-value">
            {{ $utils.formatNum(messageConfig.parentBaseFee, 1000000000) }}
            nanoFIL
          </dd>
        </dl>
      </div>
      <div class="mini-card" v-loading="messageLoading">
        <div class="sub-title border-top">消息列表</div>
        <div class="title-bar flex">
          <span class="content-title">共 {{ totalMessage }} 消息</span>
          <el-select
            :popper-append-to-body="false"
            @change="fnSelectItem"
            v-model="params.method"
            size="mini"
            placeholder="请选择"
          >
            <el-option value="" label="全部">全部</el-option>
            <el-option v-for="item in selectData" :value="item" :key="item">
              {{ item }}
            </el-option
            >
          </el-select>
        </div>
        <div class="rows" v-for="(item, index) in dataList" :key="index">
          <div class="item text-mini flex justify-between">
            <div class="name">消息ID</div>
            <div class="cp hover-color" :title="item.messageid">
              {{ $utils.centerEllipsis(item.messageid) }}
            </div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name">发送方</div>
            <div
              class="cp bright-color hover-color"
              :title="item.from"
              @click="goPage('account', item.from)"
            >
              {{ $utils.centerEllipsis(item.from) }}
            </div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name">接收方</div>
            <div
              class="cp bright-color hover-color"
              :title="item.to"
              @click="goPage('address', item.to)"
            >
              {{ $utils.centerEllipsis(item.to) }}
            </div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name">方法</div>
            <div>{{ item.method }}</div>
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name">金额</div>
            {{ $utils.fromWei(item.amount, "ether", 18) }} FIL
          </div>
          <div class="item text-mini flex justify-between">
            <div class="name">状态</div>
            <div>{{ transformStatus(item.status) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 消息列表 -->

    <pagination
      v-show="totalMessage > 0"
      :total="totalMessage"
      :page.sync="params.page"
      :limit.sync="params.page_size"
      @pagination="messageList"
    />
  </div>
</template>
<script>
import {getDatas} from "@/utils/method"
import {fetchBlockIdDetail, fetchBlockMessageList} from "@/api/common"
import {convertStatus} from "./blockMix"

export default {
  data() {
    return {
      params: {
        page: 1,
        page_size: 20,
        method: "",
      },
      messageLoading: false,
      messageInfo: [],
      totalMessage: 0,
      loading: false,
      otherInfo: [],
      messageConfig: {},
      dataList: [],
      selectData: [],
    }
  },
  computed: {},
  mounted() {
    this.getLists()
    this.messageList()
  },
  watch: {
    "$route.params.belongId": {
      handler(newVal, oldValue) {
        this.getLists()
        this.messageList("reset")
      },
    },
  },
  methods: {
    // 获取消息详情
    getLists() {
      getDatas
        .call(
          this,
          fetchBlockIdDetail({
            blockid: this.$route.params.belongId,
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
    fnSelectItem(val) {
      this.params.method = val
      this.messageList("reset")
    },

    // 消息列表
    messageList(type) {
      if (type === "reset") {
        this.params.page = 1
      }
      getDatas
        .call(
          this,
          fetchBlockMessageList({
            page: this.params.page - 1,
            page_size: this.params.page_size,
            method: this.params.method,
            blockid: this.$route.params.belongId,
          }),
          "messageLoading"
        )
        .then((res) => {
          if (res.data) {
            this.totalMessage = res.data?.totalMessage
            this.selectData = res.data?.methodList
            this.dataList = res.data?.messageList
          }
        })
    },
    goPage(name, id) {
      this.$router.push({path: `/${name}/${id}`})
    },
    transformStatus(status) {
      return convertStatus(status)
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

  .region-key {
    .rank-icon {
      width: 1rem;
      height: 0.75rem;
    }
  }
}

.mini-card {
  background-color: #fff;
}
</style>
