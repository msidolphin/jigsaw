const config = require('./webpack.base.conf')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const devConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    app: path.join(__dirname, '../demo/main.js')
  },
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/'
  },
  devServer: {
    port: '8082',
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: {
      index: '/index.html'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), 
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../index.html')
    })
  ]
}

module.exports = merge(config, devConfig)
