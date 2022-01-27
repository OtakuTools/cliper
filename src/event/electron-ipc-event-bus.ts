import { EventBus } from "@/event/event-bus";

export class ElectronIpcEventBus extends EventBus {
  ipcMain: any
  ipcRender: any
  constructor(ipcMain: any) {
    super();
    this.ipcMain = ipcMain;
  }

  on(eventName: string, callback: (...data: any) => void) {
    this.ipcMain.on(eventName, callback);
  }

  off(eventName: string, callback?: (...data: any) => void) {
    this.ipcMain.off(eventName, callback);
  }

  emit(eventName: string, ...data: any) {
    this.ipcMain.emit(eventName, data);
  }
}
