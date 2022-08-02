/**
 * Created by lyx on 2022/3/23.
 */
import request from '@/utils/request'

// 封装成本估算
export function packConst (params) {
  return request({
    url: '/packConst',
    method: 'get',
    params
  })
}

// 获取全网数据
export function fetchAllData (params) {
  return request({
    url: '/qurryTotalCommon',
    method: 'get',
    params
  })
}
// 获取有效算力排行
export function fetchPowerData (params) {
  return request({
    url: '/qurryEffectivePower',
    method: 'get',
    params
  })
}
// 大额转账
export function largeTransaction (params) {
  return request({
    url: '/largeTransaction',
    method: 'get',
    params
  })
}
// // 获取Gas费率
// export function fetchGasData (params) {
//   return request({
//     url: '/qurryGasFee',
//     method: 'get',
//     params
//   })
// }
// 获取gas基础费率走势
export function queryGasFreeChart (params) {
  return request({
    url: '/queryGasFreeChart',
    method: 'get',
    params
  })
}
// 获取出块数排行
export function fetchBlockSumData (params) {
  return request({
    url: '/qurryBlockOutputRank',
    method: 'get',
    params
  })
}
// 获取幸运值排行
export function minerBlockList (params) {
  return request({
    url: '/minerBlockList',
    method: 'post',
    data: params
  })
}
// 获取算力增速排行
export function fetchPowerSpeedData (params) {
  return request({
    url: '/qurryPowerGrowth',
    method: 'get',
    params
  })
}

// 节点gas消耗排行
export function queryNodeGasUseRank (params) {
  return request({
    url: '/queryNodeGasUseRank',
    method: 'get',
    params
  })
}

// 获取富豪排行
export function fetchRichData (params) {
  return request({
    url: '/qurryRichRank',
    method: 'get',
    params
  })
}
// 获取最新区块排行
export function fetchBlockData (params) {
  return request({
    url: '/qurryExplosiveBlock',
    method: 'get',
    params
  })
}

// 获取最新区块排行
export function fetchGas24 (params) {
  return request({
    url: '/qurryGasFeeData',
    method: 'get',
    params
  })
}

// 获取账户详情
export function qurryAccountDetail (params) {
  return request({
    url: '/qurryAccountDetail',
    method: 'get',
    params
  })
}

// 头部搜索
export function fetchSearch (params) {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}

// 账户消息列表
export function fetchAccountMessageList (params) {
  return request({
    url: '/qurryAccountMessageList',
    method: 'get',
    params
  })
}

// 账户区块列表
export function fetchAccountBlockList (params) {
  return request({
    url: '/qurryAccountBlockList',
    method: 'get',
    params
  })
}

// 账户转账列表
export function fetchAccountTransferList (params) {
  return request({
    url: '/qurryAccountTransferList',
    method: 'get',
    params
  })
}

// 账户存储服务统计
export function qurryStorageStatistics (params) {
  return request({
    url: '/qurryStorageStatistics',
    method: 'get',
    params
  })
}

// 账户变化
export function qurryAccountVariety (params) {
  return request({
    url: '/qurryAccountVariety',
    method: 'get',
    params
  })
}

// 账户算力变化
export function qurryAccountPowerVariety (params) {
  return request({
    url: '/qurryAccountPowerVariety',
    method: 'get',
    params
  })
}
// 账户详情
export function fetchAccountDetail (params) {
  return request({
    url: '/qurryAccountDetail',
    method: 'get',
    params
  })
}
// 账户变化
export function fetchAccountChangeList(params) {
  return request({
    url: '/qurryAccountChangeList',
    method: 'get',
    params
  })
}
// 账户消息详情
export function fetchMessageDetail (params) {
  return request({
    url: '/qurryMessageDetail',
    method: 'get',
    params
  })
}
// 所属区块-消息列表
export function fetchBlockMessageList (params) {
  return request({
    url: '/qurryBlockMessageList',
    method: 'get',
    params
  })
}

// 区块高度详情
export function fetchBlockDetail (params) {
  return request({
    url: '/qurryBlockDetail',
    method: 'get',
    params
  })
}

// 区块详情
export function fetchBlockIdDetail (params) {
  return request({
    url: '/qurryBlockIdDetail',
    method: 'get',
    params
  })
}

// 全网算力走势
export function qurryStatsPower (params) {
  return request({
    url: '/qurryStatsPower',
    method: 'get',
    params
  })
}

// 订单列表
export function qurryOrderList (params) {
  return request({
    url: '/qurryOrderList',
    method: 'get',
    params
  })
}

// 订单详情
export function qurryOrderDetail (params) {
  return request({
    url: '/qurryOrderDetail',
    method: 'get',
    params
  })
}

// 内存池列表
export function qurryMemPoolList (params) {
  return request({
    url: '/qurryMemPoolList',
    method: 'get',
    params
  })
}

// 存储提供者算力增量走势
export function qurryGrowthMovements (params) {
  return request({
    url: '/qurryGrowthMovements',
    method: 'get',
    params
  })
}

// 提供存储服务收益变化
export function qurryMineRewardChange (params) {
  return request({
    url: '/qurryMineRewardChange',
    method: 'get',
    params
  })
}

// 扇区质押量变化
export function qurryPledgeChange (params) {
  return request({
    url: '/qurryPledgeChange',
    method: 'get',
    params
  })
}

// 全网新增孤块走势
export function qurryLonelyBlock (params) {
  return request({
    url: '/qurryLonelyBlock',
    method: 'get',
    params
  })
}

export function queryOrphanStatistics (params) {
  return request({
    url: '/queryOrphanStatistics',
    method: 'get',
    params
  })
}

// 全网算力趋势
export function queryPowerChangeList (params) {
  return request({
    url: '/queryPowerChangeList',
    method: 'get',
    params
  })
}

// 节点算力损失统计
export function queryPowerLossStatistics (params) {
  return request({
    url: '/queryPowerLossStatistics',
    method: 'get',
    params
  })
}
