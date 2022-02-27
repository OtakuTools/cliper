const webpack = require('webpack');
const isExtensionMode = process.env.npm_lifecycle_event.toString().includes('extension:');
const electronConfig = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'cn.otakutools.cn',
        productName: 'clip',
        copyright: 'Copyright © 2021 Otakutools',
        directories: {
          output: './dist_electron',
        },
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64', 'ia32'],
            },
          ],
        },
        nsis: {
          // https://www.jianshu.com/p/1701baa240fd
          oneClick: false,
          perMachine: true,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'clip',
        },
        mac: {
          target: [
            {
              target: 'pkg'
            }
          ]
        },
        pkg: {
          
        }
      },
    }
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      }]
    },
  },
};

const extensionConfig = {
  configureWebpack: {
    module: {
      rules: [{
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.IS_EXTENSION': true,
        // 'process.env.NODE_ENV': 'development',
      })
    ]
  },
  // extension
  devServer: {
    writeToDisk: true,
    hot: false,
    disableHostCheck: true
  },
  filenameHashing: false,
  pages: {
    // options: {
    //   entry: 'src/extentsions/options/index.ts',
    //   template: 'public/index.html',
    //   filename: 'options.html',
    //   title: 'Options',
    //   chunks: ['chunk-vendors', 'chunk-common', 'options']
    // },
    popup: {
      entry: 'src/extentsions/popup/index.ts',
      template: 'public/index.html',
      filename: 'popup.html',
      title: 'Popup',
      chunks: ['chunk-vendors', 'chunk-common', 'popup']
    }
  },
  css: {
    extract: true
  },
  chainWebpack: require('./chainWebpack.config.js'),
};

module.exports =
  isExtensionMode ?
    extensionConfig :
    electronConfig;
