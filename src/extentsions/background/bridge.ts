import { EventName } from '@/constant';

/** bus事件回调 */
type EventCallback = (event: unknown, ...arg: any[]) => void;

/** bus的简单实现 */
// TODO: 复用@/store/bridge中的bus
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

export default new ExtensionBridge();
