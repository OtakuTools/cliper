import { isElectron, EventName } from '../constant'

/** bus事件回调 */
type EventCallback = (event: unknown, ...arg: any[]) => void;

/** bus的简单实现 */
class Bus {
  handlers: { [event in EventName]?: EventCallback[] } = {};

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

  /** 发送消息 */
  send(event: EventName, ...payload: any[]) {
    this.handlers[event]?.forEach(callback => {
      callback(event, ...payload);
    })
  }
}

function getBridge() {
  if (isElectron) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ipcRenderer } = require('electron');
    return ipcRenderer;
  } else {
    return new Bus();
  }
}

/** 跨进程通信 */
export const bridge = getBridge();

/** 页面bus */
export const bus = new Bus();

