import { EventBus } from "@/event/event-bus";

type CallbackFunction = (...args: any) => void;

export class H5EventBus extends EventBus {
  private eventListenersMap: Map<string, CallbackFunction[]>;

  constructor() {
    super();
    this.eventListenersMap = new Map<string, CallbackFunction[]>();
  }

  /**
   * 事件监听
   * @param eventName
   * @param fn
   */
  on(eventName: string, fn: CallbackFunction) {
    const eventQueue: Array<CallbackFunction> = this.eventListenersMap.get(eventName) || [];
    eventQueue.push(fn);
    if (eventQueue.length === 1) {
      this.eventListenersMap.set(eventName, eventQueue);
    }
  }

  /**
   * 注销事件
   * @param eventName 事件名
   * @param fn 回调方法
   */
  off(eventName: string, fn?: CallbackFunction) {
    // 如果有eventName
    if (eventName) {
      if (fn) {
        const eventQueue: Array<CallbackFunction> = this.eventListenersMap.get(eventName) || [];
        const index = eventQueue.findIndex((element) => element === fn);
        eventQueue.splice(index, 1);
      } else {
        this.eventListenersMap.delete(eventName);
      }
    } else {
      // 如果没有传eventName，则全量清空
      this.eventListenersMap.clear();
    }
  }

  emit(eventName: string, ...data: any) {
    try {
      if (eventName) {
        const eventQueue: Array<CallbackFunction> = this.eventListenersMap.get(eventName) || [];
        let l = eventQueue.length;
        while (l--) {
          eventQueue[l].apply(this, [ ...data ]);
        }
      }
    } catch (e) {
      console.error('event fire exception:', e);
    }
  }
}
