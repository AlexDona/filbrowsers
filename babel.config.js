module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [["import", {
    "libraryName": "view-design",
    "libraryDirectory": "src/components"
  }],
  ["transform-es2015-arrow-functions", { spec: true }]
  ]
}
