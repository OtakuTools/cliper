import { isElectron, isExtension } from '../constant';
import { ElectronIpcEventBus } from './electron-ipc-event-bus';
import { H5EventBus } from './h5-event-bus';
import { ExtenesionEventBus } from './extension-event-bus';

export const createEventBus = (bus?: any) => {
  if (isElectron) {
    return new ElectronIpcEventBus(bus);
  } else if (isExtension) {
    return new ExtenesionEventBus();
  } else {
    return new H5EventBus();
  }
}

