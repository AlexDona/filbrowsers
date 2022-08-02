// 转换状态
export function  convertStatus(status) {
  return status === 0 ? 'OK' : 'N/A'
}

export function  convertType(type) {
  // burn-销毁，reward-区块奖励 transfer -发出
  const typeTxt = {
    burn: '销毁',
    reward: '区块奖励',
    transfer: '发出',
    send: '发出',
    receive: '接收',
    'burn-fee': '销毁手续费',
    'miner-fee': '存储提供者手续费'
  }
  return typeTxt[type] 
}
