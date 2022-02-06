import { Config } from "@/config";

export interface SocketMessage {
  name: string
  type: "url" | "text"
  data: string
  size: number
  timestamp: number
}

export class SocketInstance {
  instanceId: string
  msgCallback: (data: SocketMessage[]) => void
  socket: WebSocket
  alive = true

  constructor(channelId: string, msgCallback: (data: SocketMessage[]) => void) {
    this.instanceId = channelId
    this.socket = new WebSocket(Config.wsServerURL + '?channelID=' + channelId);
    this.msgCallback = msgCallback;
    this.initEvent();
  }

  socketSend(message: SocketMessage[]): void {
    this.alive && this.socket.send(JSON.stringify(message))
  }

  initEvent(): void {
    this.socket.addEventListener('message', ({ data: data }) => {
      try {
        this.msgCallback(JSON.parse(data) as SocketMessage[]);
      } catch (e) {
        console.log(e);
      }
    });

    this.socket.addEventListener('close', (e) => {
      console.log('close', e);
      this.setOffline();
    })
    this.socket.addEventListener('error', (e) => {
      console.log('error', e);
    })
    this.socket.addEventListener('disconnect', (e) => {
      console.log('disconnect', e);
      this.setOffline();
    })

    this.keepAlive();
  }

  setOffline(): void {
    this.alive = false;
  }

  keepAlive(): void {
    setInterval(() => {
      this.socketSend([]);
    }, 10000);
  }

  close(): void {
    this.alive && this.socket.close()
  }

  getInstanceId() {
    return this.instanceId
  }
}
