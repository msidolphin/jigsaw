const merge = require('webpack-merge')
const path = require('path')
const webpackBaseConfig = require('./webpack.base.conf.js')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

var config = {}

if (isProd) {
  config = merge(webpackBaseConfig, {
    entry: {
      'jigsaw': path.join(__dirname, '../src/index.js')
    },
    output: {
      path: path.join(__dirname, '../dist'),
      filename: 'jigsaw.min.js',
      library: 'jigasw',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader'
              },
              'postcss-loader'
            ]
          })
        },
        {
          test: /\.(less)$/,
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                  loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                      minimize: true
                    }
                },
                'less-loader'
            ]
          })
        }
      ]
    },
    plugins: [
      // new CopyWebpackPlugin([
      //   {
      //     from: path.resolve(__dirname, '../assets'),
      //     to: 'dist',
      //     ignore: ['.*']
      //   }
      // ]),
      new ExtractTextWebpackPlugin('index.css'),
      new UglifyJsPlugin({
       parallel: true,
       sourceMap: true
      })
    ]
  })
}

module.exports = config
