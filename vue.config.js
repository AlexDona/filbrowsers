const path = require('path'); //引入path模块
const port = process.env.port || process.env.npm_config_port || 9888
const TerserJSPlugin = require('terser-webpack-plugin')
const execSync = require('child_process').execSync
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}
// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

// 输出一个编译日期，方便我们检查部署是否生效
const builtAt = (() => {
  let now = new Date()
  return (
    now.getFullYear() +
      ('00' + (now.getMonth() + 1)).substr(-2) +
      ('00' + now.getDate()).substr(-2) +
      ('00' + now.getHours()).substr(-2) +
      ('00' + now.getMinutes()).substr(-2)
  )
})()
// 输出一个git版本号，方便我们检查部署是否生效
const gitVersion = (() => {
  try {
    return (execSync('git rev-parse --short HEAD') + '').trim()
  } catch (e) {
    console.error('获取 GIT 版本号失败:' + e)
    return ''
  }
})()
// 静态文件服务器地址
const publicPath = (() => {
  let path = process.env.NODE_ENV === 'development' ? '/' : './'
  console.log(process.env.NODE_ENV, '\x1b[32m process.env')
  if (!path.endsWith('/')) path = path + '/'
  return path
})()

const env = {
  BASE_URL: '/',
  BUILD_AT: builtAt,
  GIT_VERSION: gitVersion,
  PUBLIC_PATH: publicPath,
}

const defines = (() => {
  let rets = {}
  for (let k in env) {
    rets['process.env.' + k] = JSON.stringify(env[k])
  }
  return rets
})()

module.exports = {
  publicPath: "/", // 项目上线打包   打包启用
  // publicPath: "./", // 项目上线打包   打包启用
  lintOnSave: false, // eslint
  // 生产环境关闭map
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: { // 反向代理
      "": {
        target: 'https://fil.f3hash.com/', // 代理到其他url的接口地址
        changeOrigin: false,
        secure: false,
        pathRewrite: {
          // '^/api': '/'
        }
      },
    }
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(false);
    //修复 Lazy loading routes Error
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none';
      return args;
    });
    // 只去除console.log
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.pure_funcs = ['console.log']
      return args
    })
    config.resolve.alias.set('@', path.resolve(__dirname, './src'))
    // 添加别名
    // config.resolve.alias
    // .set('static', resolve('public'))
    // .set('views', resolve('src/views'))
    // .set('common', resolve('src/common'))
    // .set('components', resolve('src/components'))

  },
  configureWebpack: {
    mode: process.env.NODE_ENV,
    context: __dirname,
    devtool: 'eval',

    plugins: [
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        template: 'public/index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: function (chunk1, chunk2) {
          var order = ['manifest', 'vendor', 'track', 'app'];  // 在此处进行配置文件顺序
          var order1 = order.indexOf(chunk1.names[0]);
          var order2 = order.indexOf(chunk2.names[0]);
          return order1 - order2;
        }
      }),
      new webpack.DefinePlugin({
        // Definitions...
        ...defines,
      }),
      // 复制静态文件
      new CopyWebpackPlugin([{ from: 'static', to: 'static', ignore: ['.*'] }]),
    ],

    optimization:
        process.env.NODE_ENV !== 'development'
          ? {
            // 把依赖的第三方模块单独编译为一个文件(webpack v4 以前是使用的CommonsChunkPlugin)
            splitChunks: {
              chunks: 'all',
            },
            minimizer: [
              new TerserJSPlugin({
                terserOptions: {
                  ecma: undefined,
                  warnings: false,
                  parse: {},
                  compress: {},
                  mangle: true, // Note `mangle.properties` is `false` by default.
                  module: false,
                  output: null,
                  toplevel: false,
                  nameCache: null,
                  ie8: false,
                  keep_classnames: undefined,
                  keep_fnames: false,
                  safari10: true,
                },
              }),
            ],
          }
          : {},

    stats: {
      hash: true,
      assets: true,
      timings: true,
      version: true,
      colors: true,
      all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
      assetsSort: '!size',
    },
  }
}
