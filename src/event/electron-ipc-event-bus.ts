import { EventBus, EventCallback } from "@/event/event-bus";

export class ElectronIpcEventBus extends EventBus {
  ipcMain: any
  ipcRender: any
  constructor(ipcMain: any) {
    super();
    this.ipcMain = ipcMain;
  }

  on(eventName: string, callback: EventCallback) {
    this.ipcMain.on(eventName, callback);
  }

  off(eventName: string, callback?: EventCallback) {
    this.ipcMain.off(eventName, callback);
  }

  emit(eventName: string, ...data: any) {
    this.ipcMain.emit(eventName, data);
  }
}
