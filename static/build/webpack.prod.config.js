const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.default.config');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    path: path.join(__dirname, '../../app/public/dist/'), // 打包后的文件存放的地方
    publicPath: '/public/dist/',
    filename: '[name]-[chunkhash:5].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify('//touyan_pingyi.databurning.com'),
        PATHDIRNAME: JSON.stringify(path.join(__dirname, '../../app/public/dist/')),
      },
    }),
  ],
});
