const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const baseWebpackConfig = require('./webpack.default.config');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    path: path.join(__dirname, '../../app/public/'), // 打包后的文件存放的地方
    publicPath: '/public/',
    filename: '[name]-[chunkhash:5].js',
  },
  plugins: [new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  })],
});
