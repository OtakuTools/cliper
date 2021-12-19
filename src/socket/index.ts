export interface SocketMessage {
  name: string
  type: "url" | "text"
  data: string
  size: number
  timestamp: number
}

export default class Socket {

  msgCallback: (data: SocketMessage[]) => void
  socket: WebSocket

  constructor(channelId: string, msgCallback: (data: SocketMessage[]) => void) {
    this.socket = new WebSocket(`ws://service-7xa83x7r-1259648581.sh.apigw.tencentcs.com:80/websocket?channelID=` + channelId);
    this.msgCallback = msgCallback;
    this.initEvent();
  }

  socketSend(message: SocketMessage[]) {
    return this.socket.send(JSON.stringify(message))
  }

  initEvent() {
    this.socket.addEventListener('message', ({ data: data }) => {
      try {
        this.msgCallback(JSON.parse(data) as SocketMessage[]);
      } catch (e) {
        console.log(e);
      }
    });

    this.socket.addEventListener('close', (e) => { console.log('close', e) })
    this.socket.addEventListener('error', (e) => { console.log('error', e) })
    this.socket.addEventListener('disconnect', (e) => { console.log('disconnect', e) })

    this.keepAlive();
  }

  keepAlive() {
    setInterval(() => {
      this.socketSend([]);
    }, 10000);
  }

  close() {
    this.socket.close()
  }
}