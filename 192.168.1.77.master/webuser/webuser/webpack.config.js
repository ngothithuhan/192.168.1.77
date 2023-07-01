//var path = require('path');
var webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//var CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // devtool: 'source-map',
  entry: //['app/index.js'],
  {
    //   'script!jquery/dist/jquery.min.js',
    // 'script!foundation-sites/dist/js/foundation.min.js',

    //    'webpack/hot/only-dev-server',
    index: 'app/index.js',
    vendor: [
      'babel-polyfill',
      "moment", "moment-range",
      //"jsonwebtoken","jwt-decode",
      "lodash.flow", "lodash.isempty",
      "react",
      "react-async-script",
      // "react-bootstrap", "react-bootstrap-validation",
      "react-csv", "react-datepicker",
      "react-redux", "react-router",
      "react-dom", "react-router-dom", "react-select",
      "react-table", "react-toastify",
      "redux"],
  },
  output: {
    path: __dirname,
    filename: './assets/jsx/[name].bundel.js'
  },
  // externals: {
  //   jquery: 'jQuery'
  // },
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     '$': 'jquery',
  //     'jQuery': 'jquery'
  //   })
  // ],


  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      '__SERVER__': 'false',
      '__BROWSER__': 'true', // you really only need one of these, but I like to have both
      // 'process.env': {
      //   'NODE_ENV': JSON.stringify('production')
      // }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: true,
    //   compress: {
    //     warnings: false, // Suppress uglification warnings
    //     pure_getters: true,
    //     unsafe: true,
    //     unsafe_comps: true,
    //     screw_ie8: true
    //   },
    //   output: {
    //     comments: false,
    //   },
    //   exclude: [/\.min\.js$/gi] // skip pre-minified libs
    // }),
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new ExtractTextPlugin('./assets/styles/style.bundle.css'),

  ],
  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['*', '.jsx', '.js', '.json', '.scss'],
    alias: {
      reducer: 'app/reducer/reducer.js',
      store: 'app/store.js',
      //khai bao action
      actionUserName: 'app/action/actionUserName.js',
      actionNotification: 'app/action/actionNotification.js',
      actionMenu: 'app/action/actionMenu.js',
      actionCloseAccount: 'app/action/actionCloseAccount.js',
      actionAddAccount: 'app/action/actionAddAccount.js',
      actionDatLenh: 'app/action/actionDatLenh.js',
      PrivateRoute: 'app/components/PrivateRoute.js',
      Main: 'app/components/Main.js',
      Transaction: 'app/components/Transaction.js',
      Notification: 'app/components/Notification.js',
      Captcha: 'app/components/Captcha.js',
      Menu: 'app/components/Menu.js',
      // Dat lenh
      DatLenh: 'app/components/VSD/DatLenh/DatLenh.js',
      ThongTinQuy: 'app/components/VSD/DatLenh/components/ThongTinQuy.js',
      UyQuyen: 'app/components/VSD/DatLenh/components/UyQuyen.js',
      ChiTiet: 'app/components/VSD/DatLenh/components/ChiTiet.js',

      DauTuDinhKi: 'app/components/VSD/DatLenh/DauTuDinhKi.js'
    }
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader', //thu vien nhu 1 chuong trinh dich
        query: {
          presets: ['es2015', 'react', 'stage-0'] // cac thu vien can de webpack no hieu dc doan ma jsx html
        },
        test: /\.jsx?$/,    //file nao xu dung trong goi bundel
        exclude: /node_modules/ //ngoai tru khog su dung
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      {
        test: /\.scss$/,

        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true }
            },
            {
              loader: 'sass-loader',
              options: { minimize: true }
            }
          ],
        })
      },
    ],



  },
  // devServer: {
  //
  //   hot: true
  // },
  node: {
    net: 'empty',
    dns: 'empty'
  },

  //remove logs Child extract-text-webpack-plugin:...
  stats: { children: false }
}
