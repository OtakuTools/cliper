import axios from "axios";
import Store from "electron-store"
import { reactive, watch } from "vue";

export const Config = {
  wsServerURL: "wss://iclass-saas.api.qcloud.com/connection/websocket",
  wsChannel: "public:news",
  wsToken: "553b9d161be673699d90e8059944489c",

  sendPassword: "",
  receivePassword: "",
};

// 用户设定库
const USER_SETTING_KEY = 'userSetting'
export type RoomInfo = {
  roomId: string
  roomPsw: string
}
export type UserSetting = RoomInfo & {
  downloadPath: string
}


type StoreType = {
  [USER_SETTING_KEY]: UserSetting
}
const store = new Store<StoreType>();

// 用户设定
export const userSetting = reactive(store.get(USER_SETTING_KEY, { roomId: '', roomPsw: '', downloadPath: ''}))
watch(userSetting, (userSetting) => {
  store.set(USER_SETTING_KEY, userSetting)
}, { deep: true })


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
