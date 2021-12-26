module.exports = {
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
      },
    }
  },
  configureWebpack: {
    module:{
      rules:[{
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }]
    },
  }
}