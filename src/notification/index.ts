import { isElectron, EVENT, FEATURE_FLAGS } from '../constant';
import { bridge } from '../store';
import { ElNotification } from 'element-plus'

type NotificationLevel = 'info' | 'warning' | 'error' | 'success';
interface NotifyOption {
  /** 通知icon */
  icon?: string;
  /** 通知content */
  content?: string;
  /** 超时自动关闭 */
  timeout?: number;
  /** click回调 */
  click?: (() => void);
  /** 取消器, resolve时关闭通知 */
  cancelToken?: Promise<void>;
}

class Notifier {
  protected constructor() {
    // 这是个抽象类
  }
  protected hasPermission(): boolean {
    return FEATURE_FLAGS.NOTIFICATION;
  }
  protected send(title: string, option: NotifyOption = {}, type: NotificationLevel = 'info'): void {
    if (!this.hasPermission()) {
      return
    }
    switch (type) {
      case 'warning':
        console.warn(title, option);
        break;
      case 'error':
        console.error(title, option);
        break;
      case 'info':
      case 'success':
      default:
        console.log(title, option);
        break;
    }
  }
  info(title: string, option: NotifyOption = {}): void {
    this.send(title, option, 'info');
  }
  warning(title: string, option: NotifyOption = {}): void {
    this.send(title, option, 'warning');
  }
  success(title: string, option: NotifyOption = {}): void {
    this.send(title, option, 'success');;
  }
  error(title: string, option: NotifyOption = {}): void {
    this.send(title, option, 'error');
  }
}

class ElNotifier extends Notifier {
  constructor() {
    super();
  }
  hasPermission(): boolean {
    return FEATURE_FLAGS.NOTIFICATION;
  }
  send(title: string, option: NotifyOption = {}, type: NotificationLevel = 'info'): void {
    if (!this.hasPermission()) {
      return
    }
    const { content, icon, cancelToken, timeout, click} = option;
    const notification = ElNotification({
      title,
      icon,
      type,
      message: content,
      duration: (timeout && timeout > 0) ? timeout : 0,
      onClick: () => {
        click?.();
        notification.close();
      }
    })
    if (cancelToken) {
      cancelToken.then(() => {
        notification.close()
      })
    }
  }
}
class WindowNotifier extends Notifier {
  constructor() {
    super();
    
    if (!this.hasPermission() && window.Notification) {
      window.Notification.requestPermission();
    } else if (WindowNotifier.refused()) {
      console.warn('无chrome通知权限')
    }
  }
  static refused(): boolean {
    return window.Notification.permission === 'denied'
  }
  hasPermission(): boolean {
    return FEATURE_FLAGS.NOTIFICATION && window.Notification.permission === "granted";
  }
  send(title: string, { content, click, icon, cancelToken, timeout }: NotifyOption = {}): void {
    if (!this.hasPermission()) {
      return
    }
    const notification = new window.Notification(title, {
      icon,
      body: content,
    });
    if (timeout && timeout > 0) {
      setTimeout(() => { notification.close() } ,timeout)
    }
    if (click) {
      notification.onclick = click;
    }
    if (cancelToken) {
      cancelToken.then(() => {
        notification.close();
      })
    }
  }
}

class ElectronNotifier extends Notifier {
  id: number;
  constructor() {
    super();
    this.id = 0;
  }
  send(title: string, option: NotifyOption = {}): void {
    if (!this.hasPermission()) {
      return
    }
    const id = this.id++;
    const { content, icon, timeout, click } = option;
    bridge.send(EVENT.SEND_NOTIFICATION, {
      id,
      title,
      content,
      icon,
    })
    if (click) {
      bridge.on(EVENT.CLOSE_NOTIFICATION, (evt, clickId) => {
        if (clickId === id) {
          click()
        }
      })
    }
    if (option.cancelToken) {
      option.cancelToken.then(() => {
        bridge.send(EVENT.CLOSE_NOTIFICATION, id);
      })
    }
    if (timeout && timeout > 0) {
      setTimeout(() => { bridge.send(EVENT.CLOSE_NOTIFICATION, id) } ,timeout)
    }
  }
}


let adapter: Notifier;
if (isElectron) {
  adapter = new ElectronNotifier();
} else if (typeof window.Notification !== 'undefined' && !WindowNotifier.refused()) {
  adapter = new WindowNotifier();
} else {
  adapter = new ElNotifier();
}

export default adapter;
