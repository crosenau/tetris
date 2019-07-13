const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
      chunkFilename: '01.css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          //{ loader: 'style-loader' },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              }
            }
          },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
};

module.exports = config;