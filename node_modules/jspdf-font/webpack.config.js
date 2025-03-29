const path = require('path')

module.exports = {
  entry: './src',
  output: {
    filename: 'index.js',
  	path: path.resolve(__dirname),
    library: 'jspdfFont',
    libraryTarget: "umd"
  },
  module: {
  	loaders: [{
  		test: /\.js$/,
  		exclude: /node_modules|fonts/,
  		loader: 'babel-loader'
  	}]
  }
}
