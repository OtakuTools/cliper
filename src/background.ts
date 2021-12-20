"use strict";

import { app, protocol, BrowserWindow, globalShortcut, clipboard, Tray, Menu, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import Store from "electron-store";

// 初始化，否则渲染进程会卡死
Store.initRenderer();

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let tray : any = null;
async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 382,
    height: 400,
    resizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  // create tray
  tray = new Tray(path.join(__dirname, 'bundled/favicon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', click: () => win.destroy() }
  ])
  tray.setToolTip('fast-clip');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    const isVisible = win.isVisible()
    console.log('tray click', isVisible)
    if (isVisible) {
      win.hide();
      win.setSkipTaskbar(true);
    } else {
      win.show();
      win.setSkipTaskbar(false);
    }
  })

  win.setMenu(null);

  win.on('minimize', () => {
    win.hide();
    win.setSkipTaskbar(true);
  })

  win.webContents.on('dom-ready', function(){
    globalShortcut.register('Alt+v',function(){
      win.webContents.send('pageData', {'text': clipboard.readText()});
    })

    // 监听渲染进程发出的download事件
    ipcMain.on('download', async (evt, args) => {
    // 打开系统弹窗 选择文件下载位置
      dialog.showOpenDialog(win, {
        properties: ['openFile', 'openDirectory']
      }).then((files: any) => {
        let saveUrl = files[0];  // 保存文件路径
        if (!saveUrl) return; // 如果用户没有选择路径,则不再向下进行
        let url = JSON.parse(args); 
        let downloadUrl = url.downloadUrl; // 获取渲染进程传递过来的 下载链接

        win.webContents.session.on('will-download', (e, item) => {
          const filePath = path.join(saveUrl, item.getFilename());
          item.setSavePath(filePath); // 'C:\Users\kim\Downloads\第12次.zip'
          //监听下载过程，计算并设置进度条进度
          item.on('updated', (evt, state) => {
            
          });
          //监听下载结束事件
          item.on('done', (e, state) => {
            
          });
        });

        win.webContents.downloadURL(downloadUrl); // 触发 will-download 事件
      })
    });

    
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  globalShortcut.unregisterAll()
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
