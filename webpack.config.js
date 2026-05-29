const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const { VueLoaderPlugin } = require('vue-loader');



module.exports = {

  entry: './src/js/app.js',//メインとなるJavaScriptファイル（エントリーポイント）
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/app.js'
  },

  mode: 'development',
  // devtool: 'source-map',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
  },
  
  watch: true,
  watchOptions: {
    aggregateTimeout: 600,
    ignored: ['node_modules/**']
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env'
                ]
              }                
            }
          ],
          exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            }
          },
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            }
          },
          'sass-loader'
        ]
      },    
      {
       test: /\.(png|jpe?g|gif|woff|woff2)$/i,
       loader: 'file-loader',
       options: {
         name: '[path][name].[ext]',
       },
      }, 
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          //publicPath: 'dist/wp-content/themes/nice/assets/img/',
          spriteFilename: 'assets/sprite.svg'
        }
      },           
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      server: {
        baseDir: './dist',
        directory: false
      },
      open: true,
      host: '172.254.99.38',
      port: 8001,
      files: ['./dist/**/*.html']
    },
    // {
    //   reload: false
    // }
    ),
    new MiniCssExtractPlugin({
      filename: 'assets/style.css',
    }),    
    new SpriteLoaderPlugin({
      plainSprite: true
    }),
    new VueLoaderPlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({}),
      new CssMinimizerPlugin(),
    ],
  },  
};