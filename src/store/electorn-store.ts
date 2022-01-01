/** 
 * @module electron-store
 * 持久储存层
 */
import { ref, reactive, watch, computed } from "vue";
import { SocketMessage } from '../socket'
import { bridge } from "./bridge";
import { USER_SETTING_KEY, UPDATE_HISTORY_KEY, HISTORY_RECORD_KEY, isElectron, EVENT, FEATURE_FLAGS, isExtension } from '../constant'

class LocalStore<T extends Record<string, unknown> = Record<string, unknown>> {
  get<Key extends keyof T>(key: Key, defaultValue: T[Key]): T[Key] {
    const s = localStorage.getItem(key as string)
    if (s) {
      return JSON.parse(s);
    } else {
      this.set(key, defaultValue);
      return this.get(key, defaultValue);
    }
  }
  set<Key extends keyof T>(key: Key, value: T[Key]): void {
    try {
      localStorage.setItem(key as string, JSON.stringify(value))
    } catch {
      console.error('写入localStorage失败')
    }
  }
}

// 用户设定库
export type RoomInfo = {
  roomId: string
  roomPsw: string
};
export type UserSetting = RoomInfo & {
  downloadPath: string
};

type StoreType = {
  [USER_SETTING_KEY]: UserSetting
  [UPDATE_HISTORY_KEY]: boolean
  [HISTORY_RECORD_KEY]: SocketMessage[]
};

// 单例模式
function getStore(): LocalStore<StoreType> {
  if (isElectron) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ElectronStore = require("electron-store") as typeof LocalStore;
    return new ElectronStore();
  } else {
    return new LocalStore<StoreType>()
  }
}
const store = getStore();

// eslint-disable-next-line @typescript-eslint/ban-types
function useStoreReactive<T extends Extract<StoreType[keyof StoreType], Record<string, unknown>>>(key: keyof StoreType, defaultValue: T) {
  const target = store.get(key, defaultValue) as T
  const targetRef = reactive<T>(target)
  watch(targetRef, (value) => {
    store.set(key, value);
  }, { deep: true })
  return targetRef
}

function useStoreRef<T extends Exclude<StoreType[keyof StoreType], Record<string, unknown>>>(key: keyof StoreType, defaultValue: T) {
  const target = store.get(key, defaultValue) as T
  const targetRef = ref<T>(target)
  watch(targetRef, (value) => store.set(key, value as T))
  return targetRef
}

/** 用户设定 */
export const userSetting = useStoreReactive(USER_SETTING_KEY, { roomId: '', roomPsw: '', downloadPath: '' });
export function formatChannelId(roomInfo: RoomInfo): string {
  return roomInfo.roomId + '_' + roomInfo.roomPsw
}
export const settingChannel = computed(() => formatChannelId(userSetting));
// 初始化用户设定
(function initDefaultSetting() {
  const randomString = (bit: number) => Math.floor(Math.random() * Math.pow(10, bit)).toString().padStart(bit, '0');
  if (FEATURE_FLAGS.INIT_DEFAULT_SETTING && isElectron && !userSetting.roomId) {
    bridge.on(EVENT.GET_SYSTEM_NAME, (evt, name: string) => {
      userSetting.roomId = name
    })
    bridge.send(EVENT.GET_SYSTEM_NAME)
  } else if (isExtension) { // FIXME: extension模式下若字段为空将无法修改, why???
    if (!userSetting.roomId) {
      userSetting.roomId = randomString(4);
    }
    if (!userSetting.roomPsw) {
      userSetting.roomPsw = randomString(4);
    }
    if (!userSetting.downloadPath) {
      userSetting.downloadPath = '/'
    }
  }
  if (FEATURE_FLAGS.INIT_DEFAULT_SETTING && !userSetting.roomPsw) {
    const randomPsw = randomString(4);
    userSetting.roomPsw = randomPsw;
  }
})();

/** 更新历史 */
export const updateHistory = useStoreRef<boolean>(UPDATE_HISTORY_KEY, true);

/** 历史列表 */
export const historyRecord = useStoreRef<SocketMessage[]>(HISTORY_RECORD_KEY, []);
