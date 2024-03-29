"use strict";

import { app, protocol, BrowserWindow, globalShortcut, clipboard, Tray, Menu, dialog, session, Notification } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import Store from "electron-store";
import fs from 'fs';
import axios from "axios";
import { FEATURE_FLAGS, EVENT, HISTORY_RECORD_KEY, UPDATE_HISTORY_KEY } from './constant'
import { bridge } from './event';
import { SocketEvent } from "./socket/socket-manager";

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
  try {
    tray = new Tray(path.join(__dirname, `${process.env.WEBPACK_DEV_SERVER_URL ? 'bundled/': ''}/favicon.ico`))
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
  } catch(e) {
    console.log('tray 失败', e)
  }

  win.setMenu(null);

  win.on('minimize', () => {
    win.hide();
    win.setSkipTaskbar(true);
  })

  // 监听渲染进程发出的input file事件
  bridge.on(EVENT.INPUT_DOWNLOAD_PATH, async (evt, opts: Electron.OpenDialogOptions = {}) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
      ...opts
    })
    if (!canceled) {
      evt.sender.send(EVENT.INPUT_DOWNLOAD_PATH, filePaths)
    }
  })

  // 监听渲染进程请求系统名
  if (FEATURE_FLAGS.INIT_DEFAULT_SETTING) {
    bridge.on(EVENT.GET_SYSTEM_NAME, (evt) => {
      evt.sender.send(EVENT.GET_SYSTEM_NAME, process.env.USERNAME || process.env.COMPUTERNAME);
    });
  }

  // 监听渲染进程请求通知
  if (FEATURE_FLAGS.NOTIFICATION && Notification.isSupported()) {
    bridge.on(EVENT.SEND_NOTIFICATION, (evt, payload = {}) => {
      const { title, content, icon, id } = payload;

      if (title) {
        const notification = new Notification({ title, icon, body: content });
        notification.show();
        // 点击事件回传
        notification.on('click', () => {
          evt.sender.send(EVENT.CLOSE_NOTIFICATION, id);
        });
        // 关闭通知
        bridge.on(EVENT.CLOSE_NOTIFICATION, (e, closeId) => {
          if (closeId === id) {
            notification.close();
          }
        });
      }
      
    })
  }

  win.webContents.on('dom-ready', function(){
    globalShortcut.register('Alt+v',function(){
      win.webContents.send(EVENT.PAGE_DATA, {'text': clipboard.readText()});
    })

    // 监听渲染进程发出的download事件
    bridge.on(EVENT.DOWNLOAD, async (evt, args) => {
      let file = JSON.parse(args); 
    // 打开系统弹窗 选择文件下载位置
      dialog.showSaveDialog(win, {
        defaultPath: file.name,
        properties: ['createDirectory', 'showHiddenFiles']
      }).then(({canceled, filePath}: any) => {
        console.log('saveUrl', canceled, filePath)
        if (canceled) return; // 如果用户没有选择路径,则不再向下进行
        let saveUrl = filePath;  // 保存文件路径d
        let downloadUrl = file.downloadUrl; // 获取渲染进程传递过来的 下载链接

        session.defaultSession.on('will-download', (event, item, webContents) => {
          event.preventDefault();
          axios.get(item.getURL(), { responseType: "stream" }).then((response: any) => {
            response.data.pipe(fs.createWriteStream(saveUrl));
          })
        })

        win.webContents.downloadURL(downloadUrl); // 触发 will-download 事件
      }).catch((e) => {
        console.error(e)
      })
    });

    bridge.on(EVENT.RESEND, async (evt, args) => {
      win.webContents.send(EVENT.CALL_RESEND, args);
    })

    bridge.on(SocketEvent.CREATE_INSTANCE, (evt, args) => {
      win.webContents.send(SocketEvent.CREATE_INSTANCE, args)
    });

    bridge.on(SocketEvent.SEND_MSG, (evt, args) => {
      console.log('background SocketEvent.SEND_MSG')
      win.webContents.send(SocketEvent.SEND_MSG, args)
    });

    bridge.on(SocketEvent.RECV_MSG, (evt, args) => {
      console.log("background SocketEvent.RECV_MSG", args);
      win.webContents.send(SocketEvent.RECV_MSG, args)
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
  const store = new Store();
  store.delete(HISTORY_RECORD_KEY);
  store.delete(UPDATE_HISTORY_KEY);
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

// 隐藏build后的默认菜单
Menu.setApplicationMenu(null);
