

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const zh_hans = {
  formatTime: {
    justNow: '刚刚',
    before: "前",
    suffix: ["天", "时", "分", "秒"]
  },
  home: {
    meta: [
      { label: '最新区块高度' },
      { label: '最新出块时间' },
      { label: '全网有效算力', tips: '当前全网有效算力（有效存储空间）的总和' },
      // { label: '活跃存储提供者', tips: '当前有效算力值大于0的矿工数' },
      { label: '区块奖励', tips: '当前高度下的区块奖励，每个高度有多个区块，每个区块均可获得该奖励'},
      { label: '平均出块时间', tips: '近24h出块的平均时间间隔'},
      { label: '24h新增算力' },
      { label: '24h平均挖矿收益', tips: '近24h每个高度出块奖励与有效算力比值的均值'},
      { label: '总账户数'},
      { label: '24h产出量', tips: '近24h累计提供存储服务产出的FIL数量' },
      { label: '活跃节点数'},
      { label: '24h消息增量'},
      { label: '平均每高度区块数 ', tips: '近24h相同高度下的平均区块数量'},
      { label: '平均每高度消息数 ', tips: '近24h相同高度下的平均消息数量'},
      { label: '平均Gas单价'},
      // { label: '当前扇区质押量'},
      // { label: 'FIL质押量', tips: '当前提供存储服务所质押的FIL总和'},
      // { label: 'FIL流通量', tips: '当前自由流通的FIL总和'},
      // // { label: '平均区块间隔', tips: '近24h出块的平均时间间隔'},
      // { label: '新增算力成本 ', tips: '新增算力所需要花费的成本，包括扇区质押和封装手续费'},
      // { label: '当前基础费率'},
      // { label: 'FIL销毁量'},
      // { label: 'FIL总供给量'},
      // { label: 'FIL流通率', tips: '流通率=流通量/总供给量'},
      // { label: '32GiB扇区Gas消耗', tips: '密封32G扇区每T所要消耗的Gas值'},
      // { label: '64GiB扇区Gas消耗', tips: '密封64G扇区每T所要消耗的Gas值'},
    ],
  },
  ...zhLocale
}
export default zh_hans
