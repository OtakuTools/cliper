import { EventBus, EventCallback } from "@/event/event-bus";

export class H5EventBus extends EventBus {
  private eventListenersMap: Map<string, EventCallback[]>;

  constructor() {
    super();
    this.eventListenersMap = new Map<string, EventCallback[]>();
  }

  /**
   * 事件监听
   * @param eventName
   * @param fn
   */
  on(eventName: string, fn: EventCallback) {
    const eventQueue: Array<EventCallback> = this.eventListenersMap.get(eventName) || [];
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
  off(eventName: string, fn?: EventCallback) {
    // 如果有eventName
    if (eventName) {
      if (fn) {
        const eventQueue: Array<EventCallback> = this.eventListenersMap.get(eventName) || [];
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
    if (eventName) {
      const eventQueue: Array<EventCallback> = this.eventListenersMap.get(eventName) || [];
      let l = eventQueue.length;
      while (l--) {
        try {
          eventQueue[l].apply(this, [ ...data ]);
        } catch(e) {
          console.error('event fire exception:', e);
        }
      }
    }
  }
}
