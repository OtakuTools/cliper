import axios from "axios";
import Store from "electron-store"
import { ref, reactive, watch } from "vue";
import { SocketMessage } from '../socket'

/** ws配置 */
export const Config = {
  wsServerURL: "wss://iclass-saas.api.qcloud.com/connection/websocket",
  wsChannel: "public:news",
  wsToken: "553b9d161be673699d90e8059944489c",

  sendPassword: "",
  receivePassword: "",
};

// 用户设定库
const USER_SETTING_KEY = 'userSetting';
export type RoomInfo = {
  roomId: string
  roomPsw: string
};
export type UserSetting = RoomInfo & {
  downloadPath: string
};
const UPDATE_HISTORY_KEY = 'updateHistoy';
const HISTORY_RECORD_KEY = 'historyRecord';

type StoreType = {
  [USER_SETTING_KEY]: UserSetting
  [UPDATE_HISTORY_KEY]: boolean
  [HISTORY_RECORD_KEY]: SocketMessage[]
};
const store = new Store<StoreType>();

// eslint-disable-next-line @typescript-eslint/ban-types
function useStoreReactive<T extends object>(key: string, defaultValue: T) {
  const target = store.get(key, defaultValue)
  const targetRef = reactive<T>(target)
  watch(targetRef, (value) => store.set(key, value), { deep: true })
  return targetRef
}

// eslint-disable-next-line @typescript-eslint/ban-types
function useStoreRef<T>(key: string, defaultValue: T) {
  const target = store.get(key, defaultValue)
  const targetRef = ref(target)
  watch(targetRef, (value) => store.set(key, value))
  return targetRef
}

/** 用户设定 */
export const userSetting = useStoreReactive(USER_SETTING_KEY, { roomId: '', roomPsw: '', downloadPath: '' });
export function formatChannelId(roomInfo: RoomInfo): string {
  return roomInfo.roomId + '_' + roomInfo.roomPsw
}

/** 更新历史 */
export const updateHistory = useStoreRef(UPDATE_HISTORY_KEY, true);

/** 历史列表 */
export const historyRecord = useStoreRef(HISTORY_RECORD_KEY, [] as SocketMessage[]);

/** Cos实例 */
export const CosInstance = new window.COS({
  async getAuthorization(options: unknown, callback: (arg0: unknown) => void) {
    // 异步获取临时密钥
    const res = await axios({
      method: "post",
      url: "https://env-nuxt-ssr-7ga885o173201dc0-1252809026.ap-shanghai.app.tcloudbase.com/transfer_cos",
      responseType: "json",
      data: {
        cmd: "getToken",
      },
    });
    const { data } = res;
    const credentials = data && data.credentials;
    if (!data || !credentials) return console.error("credentials invalid");
    callback({
      TmpSecretId: credentials.tmpSecretId,
      TmpSecretKey: credentials.tmpSecretKey,
      XCosSecurityToken: credentials.sessionToken,
      StartTime: data.startTime,
      ExpiredTime: data.expiredTime,
    });
  },
});
