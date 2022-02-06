import { EventBus, EventCallback } from "@/event/event-bus";

export class ElectronIpcEventBus extends EventBus {
  ipc: any
  
  constructor(ipc: any) {
    super();
    this.ipc = ipc;
  }

  on(eventName: string, callback: EventCallback) {
    this.ipc.on(eventName, callback);
  }

  off(eventName: string, callback?: EventCallback) {
    this.ipc.off(eventName, callback);
  }

  emit(eventName: string, ...payload: any) {
    this.ipc.send(eventName, payload);
  }
}
