/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDevMode = process.env.NODE_ENV === 'development'

const chainWebpack = config => {
  config.entry('background').add(path.resolve(__dirname, './src/extentsions/background/index.ts'))
  config.entry('contentScripts').add(path.resolve(__dirname, './src/extentsions/contentScripts/index.ts'))
  config.output.filename('[name].js')
  config.plugins.delete('copy')

  config.plugin('CopyWebpackPlugin').use(CopyWebpackPlugin, [[
    { from: 'src/assets', to: 'assets' },
    { from: 'src/extentsions/manifest.json', to: 'manifest.json', flatten: true }
  ]])

  if (isDevMode) {
    // development-mode
    config.plugin('ExtensionReloader').use(ExtensionReloader, [{
      contentScript: 'contentScripts',
      background: 'background',
      extensionPage: 'popup',
      options: 'options'
    }])

    config.plugin('CleanWebpackPlugin').use(CleanWebpackPlugin, [{
      cleanAfterEveryBuildPatterns: ['*hot-update*'],
      cleanStaleWebpackAssets: false
    }])
  }

  config.optimization.clear()
}

module.exports = chainWebpack
