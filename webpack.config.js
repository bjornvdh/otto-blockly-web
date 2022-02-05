const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const app = path.join(__dirname, 'app');
const www = path.join(__dirname, 'www');
const dist = path.join(__dirname, 'dist');
const templates = path.join(__dirname, 'templates');

module.exports = {
  entry: {
    app: path.join(app, './index.js')
  },
  devtool: 'inline-source-map',
  devServer: {
    https: {
      //ca: fs.readFileSync('ottoschool.com.ca'),
      //pfx: './path/to/server.pfx',
      key: fs.readFileSync('ottoschool.com.key'),
      cert: fs.readFileSync('ottoschool.com.crt')
      //passphrase: 'webpack-dev-server'
    },
    contentBase: www,
    port: 443,
    allowedHosts: ['local.arduino.cc'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(templates, 'index.html')
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: dist
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
