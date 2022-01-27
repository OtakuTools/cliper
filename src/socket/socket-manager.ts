import { SocketInstance } from "./socket-instance";
import { H5EventBus, ElectronIpcEventBus } from "@/event";

export enum SocketEvent {
  SEND_MSG = 'send_msg',
  RESEND_MSG = 'resend_msg',
  RECV_MSG = 'recv_msg',
  CREATE_INSTANCE = 'create_instance'
}

export class SocketManager {
  socketInstanceMap: Map<string, SocketInstance>
  eventBus: H5EventBus | ElectronIpcEventBus

  constructor(eventBus: H5EventBus | ElectronIpcEventBus) {
    this.socketInstanceMap = new Map<string, SocketInstance>();
    this.eventBus = eventBus;
  }

  createInstance(channelId: string) {
    const instance = new SocketInstance(channelId, (data) => {
      //  接收信令
      this.recvMessage(channelId, data);
    })
    this.socketInstanceMap.set(channelId, instance)
  }

  deleteInstance(channelId: string) {
    const instance = this.socketInstanceMap.get(channelId)
    if (instance) {
      instance.close();
      this.socketInstanceMap.delete(channelId);
    }
  }

  sendMessage(channelId: string, data: any) {
    const instance = this.socketInstanceMap.get(channelId)
    if (instance) {
      instance.socketSend(data);
    }
  }

  recvMessage(channelId: string, data: any) {
    this.eventBus.emit(SocketEvent.RECV_MSG, channelId, data);
  }
}
