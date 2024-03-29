import { isElectron, EventName, EVENT, isExtension } from '../constant';
import axios from 'axios';

/** bus事件回调 */
type EventCallback = (event: unknown, ...arg: any[]) => void;

/** bus的简单实现 */
class Bus {
  protected handlers: { [event in EventName]?: EventCallback[] } = {};

  /** 监听消息 */
  on(event: EventName, callback: EventCallback) {
    this.handlers[event] = (this.handlers[event] || []).concat([callback]);
  }
  once(event: EventName, callback: EventCallback) {
    const warpedHandler: EventCallback = (...payload) => {
      callback(event, ...payload);
      this.removeListener(event, warpedHandler);
    }
    this.on(event, warpedHandler);
  }
  removeListener(event: EventName, callback: EventCallback) {
    (this.handlers[event] || []).filter(handler => handler !== callback);
  }
  /** 删除所有的监听者，或者删除指定 event 中的全部. */
  removeAllListeners(event?: EventName) {
    if (!event) {
      this.handlers = {};
    } else {
      this.handlers[event] = [];
    }
  }
  
  /** 触发事件 */
  protected trigger(event: EventName, payload: any[]) {
    this.handlers[event]?.forEach(callback => {
      callback(event, ...payload);
    })
  }

  /** 发送消息 */
  send(event: EventName, ...payload: any[]) {
    this.trigger(event, payload);
  }
}

interface ExtensionBridgeMessage {
  event: EventName;
  payload: any[];
}
class ExtensionBridge extends Bus implements Bus {
  constructor() {
    super();
    window.chrome.runtime.onMessage.addListener((message: ExtensionBridgeMessage) => {
      this.trigger(message.event, message.payload);
    })
  }
  send(event: EventName, ...payload: any[]) {
    try {
      window.chrome.runtime.sendMessage(this.formatMessage(event, payload));
    } catch (err) {
      console.error('Chrome Extension Bridge SendMessage Error', err);
    }
  }
  private formatMessage(event: EventName, payload: any[]): ExtensionBridgeMessage {
    return {
      event,
      payload
    };
  }
}

// 纯js下载文件
function downloadFile(file: any): Promise<void> {
  return axios({
    url: file.downloadUrl,
    method: 'get',
    responseType: 'blob'
  }).then((res) => {
    const link = document.createElement('a');
    const blob: Blob = res.data;
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', file.name);
    link.click();
  })
}

// web端bridge实现
function initLocalBridge(bridge: Bus): Bus {
  // download事件
  bridge.on(EVENT.DOWNLOAD, (evt, payload) => {
    try {
      const file = JSON.parse(payload);
      downloadFile(file);
    } catch (err) {
      console.error('下载文件失败', err);
    }
  })

  return bridge;
}

// extension bridge
function initExtensionBridge(bridge: ExtensionBridge): ExtensionBridge {
  // background回传的download事件
  bridge.on(EVENT.DOWNLOAD, (evt, payload) => {
    console.warn('extension download fallback');
    try {
      const file = JSON.parse(payload);
      // no access to extension downloads API, fallback to axios download
      downloadFile(file);
    } catch (err) {
      console.error('下载文件失败', err);
    }
  })

  return bridge;
}

function getBridge() {
  if (isElectron) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ipcRenderer } = require('electron');
    return ipcRenderer;
  } else if (isExtension) { 
    const bridge = new ExtensionBridge();
    initExtensionBridge(bridge);
    return bridge;
   } else {
    const bridge = new Bus();
    initLocalBridge(bridge);
    return bridge;
  }
}

/** 跨进程通信 */
export const bridge = getBridge();

/** 页面bus */
export const bus = new Bus();

