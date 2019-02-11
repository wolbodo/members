const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('sapper/config/webpack.js')
const pkg = require('./package.json')

const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: {
      extensions: ['.js', '.json', '.html', '.svelte'],
      mainFields: ['svelte', 'module', 'browser', 'main'],
      alias: {
        src: path.resolve(__dirname, 'src/')
      }
    },
    module: {
      rules: [
        {
          test: /\.(html|svelte)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              hotReload: true,
              store: true
            }
          }
        }, {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    mode,
    plugins: [
      dev && new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.GRAPHQL_URI': JSON.stringify(process.env.GRAPHQL_URI)
      })
    ].filter(Boolean),
    devtool: dev && 'inline-source-map'
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: 'node',
    resolve: {
      extensions: ['.js', '.json', '.html', '.svelte'],
      mainFields: ['svelte', 'module', 'browser', 'main'],
      alias: {
        src: path.resolve(__dirname, 'src/')
      }
    },
    externals: Object.keys(pkg.dependencies)
                .filter(name => !name.startsWith('svelte-select'))
                .filter(name => !name.startsWith('@dxlb/svelte-'))
								.concat('encoding'),
    module: {
      rules: [
        {
          test: /\.(html|svelte)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: false,
              generate: 'ssr',
              store: true,
              dev
            }
          }
        }
      ]
    },
    mode: process.env.NODE_ENV,
    performance: {
      hints: false // it doesn't matter if server.js is large
    }
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV
  }
}
