import { EventName } from '../constant';

export type EventCallback = (...args: any) => void;

export abstract class EventBus {
  abstract on(eventName: EventName, callback: EventCallback): void
  abstract off(eventName: EventName, callback?: EventCallback): void
  abstract emit(eventName: EventName, ...payload: any[]): void

  once(eventName: EventName, callback: EventCallback) {
    const warpedHandler: EventCallback = (...payload) => {
      callback(eventName, ...payload);
      this.off(eventName, warpedHandler);
    }
    this.on(eventName, warpedHandler);
  }
}
