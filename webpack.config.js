var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ESelect',
    libraryTarget: 'umd'
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'template.html',
    inject: 'head'
  })]
}
