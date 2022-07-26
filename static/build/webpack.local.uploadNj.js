const port = process.env.port;
const publicPath = `//localhost:${port}/app/public/dist/`
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  entry: './index.js',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // devtool: false,
  output: {
    path: path.join(__dirname, '../../app/public/dist/'), // 打包后的文件存放的地方
    publicPath,
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin('燃数科技出品，翻版必究'),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../../app/view/index.nj'),
      template: path.resolve(__dirname, '../src/page/html/index.ejs'),
      favicon: path.resolve(__dirname, '../src/page/image/favicon.ico'),
    }),
  ],
};

module.exports = webpackConfig
