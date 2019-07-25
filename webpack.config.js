const path = require('path');

const config = {
  mode: 'development',
  entry: path.join(__dirname, 'src/js/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    publicPath: '/dist',
    port: 3000,
    //disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'url-loader',
        }]
      }
    ]
  },
};

module.exports = config;