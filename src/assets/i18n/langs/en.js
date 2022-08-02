import element_en from 'element-ui/lib/locale/lang/en'
const en = {
  formatTime: {
    before: "ago",
    suffix: ["day", "hr", "min", "s "]
  },
  home: {
    meta: [
      { label: 'Block Height' },
      { label: 'Latest Block' },
      { label: 'Network Storage Power', tips: 'Total adjusted storage power (storage space) of the network.' },
      { label: 'Active Miners', tips: 'Amount of miners that has a positive storage power.' },
      { label: 'Block Reward', tips: 'Block reward of current tipset height. Every tipset could have multiple blocks, and every block receives the same reward.'},
      { label: '24h Average Mining Reward', tips: 'Average value in last 24h of the ratio of total block rewards at every tipset and corresponding adjusted storage power.'},
      { label: '24h FIL Production', tips: 'New FILs minted in last 24h.' },
      { label: 'Current Sector Initial Pledge'},
      { label: 'Total Pledge Collateral', tips: 'FILs pledged by miners.'},
      { label: '24h Messages'},
      { label: 'Circulating Supply', tips: 'Circulating supply of FIL.'},
      { label: 'Total Accounts'},
      { label: 'Average Block Interval', tips: 'Average block interval in last 24h.'},
      { label: 'Average Blocks per Tipset', tips: 'Average blocks produced per tipset in last 24h.'},
      { label: 'Cost of Sealing Sectors', tips: 'The cost of sealing sectors, including sector initial pledge and message fees'},
      { label: 'Current Base Fee'},
      { label: 'Burnt FIL'},
      { label: 'Total Max Supply'},
      { label: 'Circulating Rate', tips: 'Circulating rate = circulating supply / max supply'},
    ],
  },
  ...element_en,
}
export default en
