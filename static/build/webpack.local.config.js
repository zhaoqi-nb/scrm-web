const port = process.env.port;
const publicPath = `//localhost:${port}/app/public/dist/`
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const WebpackDevServer = require('webpack-dev-server')
const baseWebpackConfig = require('./webpack.default.config');

const mode = JSON.stringify(process.env.NODE_ENV);

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // devtool: false,
  output: {
    path: path.join(__dirname, '../../app/public/dist/'), // 打包后的文件存放的地方
    publicPath,
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      exclude: /node_modules/, // 排除node_modules文件夹
      enforce: 'pre', // 提前加载使用
      use: {
        loader: 'eslint-loader', // 使用eslint-loader解析
        options: {
          fix: true,
        },
      },
    }],
  },
  plugins: [new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: mode,
    },
  })],
});
const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  hot: true,
  compress: true,
  disableHostCheck: true,
  progress: true,
  port, // 设置端口号
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  publicPath,
  inline: true,
  stats: {
    all: false,
    errors: true,
    warnings: true,
    // chunks: true,
    assets: true,
    hash: true,
    builtAt: true,
    colors: true,
  },
  overlay: { // 在编译过程中有任何错误，可以显示在网页上,在浏览器上全屏显示编译的errors或warnings。默认是关闭的
    warnings: false,
    errors: true
  },
})
const runServer = async () => {
  console.log('Starting server...');
  await server.listen(port, 'localhost');
};

runServer();
