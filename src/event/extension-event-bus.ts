import { H5EventBus } from "./h5-event-bus";
import { EventName } from '../constant';

interface ExtensionBridgeMessage {
  event: EventName;
  payload: any[];
}

export class ExtenesionEventBus extends H5EventBus {
  constructor() {
    super();
    window.chrome.runtime.onMessage.addListener((message: ExtensionBridgeMessage) => {
      this.emit(message.event, message.payload);
    })
  }

  emit(eventName: string, ...payload: any): void {
    try {
      window.chrome.runtime.sendMessage({
        event: eventName,
        payload: payload
      });
    } catch (err) {
      console.error('Chrome Extension Bridge SendMessage Error', err);
    }
  }
} 