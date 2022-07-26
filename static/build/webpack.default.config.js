const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack')

const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer')
// const pxToRem = require('postcss-pxtorem')
// const postcssFlexBugs = require('postcss-flexbugs-fixes')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Alias = require('./alias');

const mode = JSON.stringify(process.env.NODE_ENV);

module.exports = {
  entry: './static/src/page/index.jsx',
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
        },
        'happypack/loader?id=babel',
      ],

      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      use: [{
        loader: 'thread-loader',
        options: {
          workers: 6,
        },
      }, {
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: [
            // postcssFlexBugs(),
            autoprefixer({
              overrideBrowserslist: [
                'last 10 Chrome versions',
                'last 5 Firefox versions',
                'Safari >= 6',
                'ie> 8'
              ]
            }),
            // pxToRem({
            //   rootValue: 14,
            //   propList: ['*']
            // }),
            mode != 'development' && require('cssnano')
          ].filter((v) => v)
        }
      }],
    }, {
      test: /\.less$/,
      use: [
        {
          loader: 'thread-loader',
          options: {
            workers: 6,
          },
        },
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader', // translates CSS into CommonJS
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              // postcssFlexBugs(),
              autoprefixer({
                overrideBrowserslist: [
                  'last 10 Chrome versions',
                  'last 5 Firefox versions',
                  'Safari >= 6',
                  'ie> 8'
                ]
              }),
              // pxToRem({
              //   rootValue: 14,
              //   propList: ['*']
              // }),
              mode != 'development' && require('cssnano')
            ].filter((v) => v)
          }
        },
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
              modifyVars: {
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
    }, {
      test: /\.(html|htm)$/i,
      use: [{
        loader: 'html-withimg-loader',
      }],
    }, {
      test: /\.(png|jpg|gif|woff|svg|eot|ttf)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 100000,
          esModule: false,
          name: '[name].[ext]',
        },
      }],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    }],
  },
  resolve: {
    extensions: [
      '.js', '.jsx',
    ],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
    alias: Alias,
  },
  externals: {
    BMap: 'BMap',
    mapv: 'mapv',
  },
  node: {
    fs: 'empty',
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!read.txt'],
    }),
    new webpack.BannerPlugin('燃数科技出品，翻版必究'),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../../app/view/index.nj'),
      template: path.resolve(__dirname, '../src/page/html/index.ejs'),
      favicon: path.resolve(__dirname, '../src/page/image/favicon.ico'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.join(__dirname, '../../app/public/dist/public')
        },
      ],
    }),
    new HappyPack({
      // 通常情况下，不需要指定此项，除非定义了多个HappyPack插件，在这种情况下，需要使用不同的ID来区分
      id: 'babel',
      // 包含将转换文件的加载程序的名称（或绝对路径）以及要传递给它的可选查询字符串。(Array)
      loaders: ['babel-loader'],
      // 用于检索工作线程的预定义线程池
      threadPool: happyThreadPool,
      // 启用此选项可将状态消息从HappyPack记录到STDOUT
      verbose: true
    })
    // new BundleAnalyzerPlugin(),
  ],
};
