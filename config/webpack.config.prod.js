const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: 'source-map',

  entry: [baseConfig.externals.paths.src],

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      { test: /\.js?$/, loader: 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0', exclude: /node_modules/ },
      { test: /\.scss?$/, loader: ExtractTextPlugin.extract('style', 'css!sass'), include: baseConfig.externals.paths.src },
      { test: /\.png$/, loader: 'file' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file' }
    ]
  }
});