import { isElectron, isExtension, isElectronBackground } from '../constant';
import { ElectronIpcEventBus } from './electron-ipc-event-bus';
import { H5EventBus } from './h5-event-bus';
import { ExtenesionEventBus } from './extension-event-bus';

export {
  ElectronIpcEventBus,
  H5EventBus,
  ExtenesionEventBus
}

export const createEventBus = () => {
  console.log('isElectronBackground', isElectronBackground, 'isElectron', isElectron)
  if (isElectronBackground) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ipcMain } = require('electron');
    return new ElectronIpcEventBus(ipcMain);
  } else if (isElectron) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ipcRenderer } = require('electron');
    return new ElectronIpcEventBus(ipcRenderer);
  } else if (isExtension) {
    return new ExtenesionEventBus();
  } else {
    return new H5EventBus();
  }
}

export const bridge = createEventBus();
