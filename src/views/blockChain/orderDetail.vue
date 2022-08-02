<template>
  <div class="orderDetail container" v-loading="loading">
    <!--  PC 端  -->
    <div class="mt-1 top-title mb-1">订单详情
      #{{ $route.params.orderId }}
      <el-popover
          class="el-popover"
          placement="top"
          width="200"
          trigger="hover"
          content="表示官方认证客户发起的文件订单，该订单有效算力约等于十倍原算力">
        <img class="tip tip-icon lg" src="@/assets/icon/verified.svg" alt=""  slot="reference">
      </el-popover>
    </div>
    <div class="w-full hide-mini">
      <div class="main mt-1">
        <el-card class="box-card border-bottom">
          <div class="border-bottom pb-1/2">
            <dl class="region-row" v-for="(item, index) in cardList" :key="index + 'row'">
              <dt class="region-key">{{ item.label }}</dt>
              <dd v-if="item.event" class="region-value cp hover-color" @click="item.event.call(this)">
                {{ item.formatter ? item.formatter(item.value) : item.value || 'N/A' }}
              </dd>
              <dd v-else class="region-value" :class="{ 'cp': item.key === 'id', 'hover-color': item.key === 'id' }">
                {{ item.formatter ? item.formatter(item.value) : item.value || 'N/A' }}
              </dd>
            </dl>
          </div>

          <div class="mt-1 pl-2 py-1 text-sm">
            托管详情
          </div>
          <div class="flex flex-row text-sm">
            <div class="flex flex-col flex-1 justify-center items-center">
              <p class="text-xs">客户</p>
              <img class="mt-1/4" src="@/assets/icon/client.svg" />
              <div class="mt-1/4">
                <p class="cp text-link" @click="goPage('account', resData.client)">{{ $utils.centerEllipsis(resData.client) }}</p>
              </div>
              <p class="text-xs">质押金额 : {{ $utils.fromWei(resData.clientCollateral, 'ether', 4) }} FIL</p>
            </div>
            <div class="flex flex-col flex-1 justify-center items-center">
              <div class="bg-background rounded-md w-full py-1">
                <div class="flex justify-center items-center">
                  <img class="tip tip-icon mr-1/2" src="@/assets/icon/file.svg" alt="" />
                  <p>{{ $utils.unitConversion(resData.pieceSize) }}</p>
                </div>
                <div class="mt-1/4">
                  <img class="w-full height-075" src="@/assets/icon/arrow-horizontal.svg" alt="" />
                </div>
                <div class="text-center text-xs mt-1/4">
                  {{ $moment(Number(resData.startTimestamp) * 1000).format('YYYY-MM-DD HH:mm') }} 至 {{ $moment(Number(resData.endTimestamp) * 1000).format('YYYY-MM-DD HH:mm') }}
                </div>
                <div class="text-center text-xs mt-1/4">托管费用: N/A</div>
              </div>
            </div>
            <div class="flex flex-col flex-1 justify-center items-center">
              <p class="text-xs">托管存储提供者</p>
              <img class="mt-1/4" src="@/assets/icon/provider.svg" />
              <div class="mt-1/4">
                <p class="cp text-link" @click="goPage('address', resData.provider)">{{ resData.provider }}</p>
              </div>
              <p class="text-xs">质押金额 : {{$utils.fromWei(resData.providerCollateral, 'ether', 4) }} FIL</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--  h5端  -->
    <div class="show-mini mini-list bg-white pb-1/2">
      <div class="px-1 flex justify-between pt-1/2" v-for="(item, index) in cardList" :key="index">
        <p class="flex-1 gray-color text-sm"> {{item.label}} </p>
        <div class="text-xs flex-4 text-right" :class="{ 'cp': item.key === 'id', 'text-link': item.key === 'height' || item.key === 'message' }">
          <span class="break-all">{{ item.formatter ? item.formatter(item.value) : item.value | handleNullDatas }}</span>
          <el-popover
              v-if="item.tip"
              class="el-popover"
              placement="top"
              width="200"
              trigger="hover"
              content="表示官方认证客户发起的文件订单，该订单有效算力约等于十倍原算力">
            <img class="tip tip-icon xs" src="@/assets/icon/verified.svg" alt=""  slot="reference">
        </el-popover>
        </div>
      </div>

      <div class="flex flex-col flex-row text-sm">
        <div class="flex flex-col flex-1 justify-center items-center">
          <p class="text-xs">客户</p>
          <img class="mt-1/4" src="@/assets/icon/client.svg" />
          <div class="mt-1/4">
            <p class="cp text-link" @click="goPage('account', resData.client)">{{ $utils.centerEllipsis(resData.client) }}</p>
          </div>
          <p class="text-xs">质押金额 : {{ $utils.fromWei(resData.clientCollateral, 'ether', 4) }} FIL</p>
        </div>
        <div class="my-1 flex flex-col flex-1 justify-center items-center px-2">
          <div class="bg-background rounded-md w-full py-1">
            <div class="flex justify-center items-center">
              <img class="tip tip-icon mr-1/2" src="@/assets/icon/file.svg" alt="" />
              <p>{{ $utils.unitConversion(resData.pieceSize) }}</p>
            </div>
            <div class="mt-1/4">
              <img class="w-full height-075" src="@/assets/icon/arrow-horizontal.svg" alt="" />
            </div>
            <div class="text-center text-xs mt-1/4">
              {{ $moment(Number(resData.startTimestamp) * 1000).format('YYYY-MM-DD HH:mm') }} 至 {{ $moment(Number(resData.endTimestamp) * 1000).format('YYYY-MM-DD HH:mm') }}
            </div>
            <div class="text-center text-xs mt-1/4">托管费用: N/A</div>
          </div>
        </div>
        <div class="my-1 flex flex-col flex-1 justify-center items-center">
          <p class="text-xs">托管存储提供者</p>
          <img class="mt-1/4" src="@/assets/icon/provider.svg" />
          <div class="mt-1/4">
            <p class="cp text-link" @click="goPage('address', resData.provider)">{{ resData.provider }}</p>
          </div>
          <p class="text-xs">质押金额 : {{$utils.fromWei(resData.providerCollateral, 'ether', 4) }} FIL</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { qurryOrderDetail } from "@/api/common"
import {getDatas} from "@/utils/method";
export default {
  name: "orderDetail",
  data() {
    const that = this
    return {
      loading: false,
      resData: {},
      cardList: [
        {
          label: '订单ID',
          key: 'id',
          tip: true
        },
        {
          label: '创建时间',
          key: 'timestamp',
          formatter: function (val) {
            return that.$moment(Number(val) * 1000).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          label: '所属区块',
          key: 'height',
        },
        {
          label: '所属消息',
          key: 'message'
        },
        {
          label: '文件Cid',
          key: 'pieceCid'
        },
        {
          label: '已验证',
          key: 'verifiedDeal'
        },
        {
          label: '状态',
          key: 'status',
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    columnsLabel() {
      const labels = this.$t("home.meta")
      let tmp = this.cardList.map((item, index) => {
        return {
          ...item,
          label: labels[index].label,
          tips: labels[index].tips,
        }
      })
    },
    async getData() {
      const res = await getDatas
        .call(this, qurryOrderDetail({ orderid: this.$route.params.orderId}), "loading")
      if (res.data) {
        this.resData = res.data
        const result = res.data
        const arr = this.cardList
        arr.data = result
        arr.map(item => {
          item.value = arr.data[item.key] || 'N/A'
          if (item.key === 'height')  item.event = () => this.goPage('height', item.value)
          if (item.key === 'message') item.event = () => this.goPage('message', item.value)
          return arr
        })
        this.cardList = arr.splice(0)
      }
      console.log(this.cardList, 'ddd')
    },
    goPage(name, id) {
      this.$router.push({ path: `/${name}/${id}` })
    },
  }
}
</script>

<style scoped lang="scss">
.orderDetail {
  .height-075 {
    height: 0.75rem;
  }
  .tip {
    width: 1.25rem;
    height: 1.25rem;
  }
  .bg-background {
    background-color: rgba(240,246,251, 1)
  }
  .line {
    &:before {
      content: '';
      display: block;
      height: 1px;
      border: 1px solid #ddd;
      width: 100%;
    }
  }
  .el-popover {
    background: none;
    position: relative;
    border: none;
    -webkit-box-shadow: unset;
    .tip-icon.lg {
      margin-left: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 1rem;
    }
    .tip-icon.xs {
      margin-left: 0;
      position: absolute;
      padding-left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 0.75rem;
    }
  }
}
</style>