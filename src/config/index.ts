import axios from "axios";
import COS from 'cos-js-sdk-v5';

/** ws配置 */
export const Config = {
  wsServerURL: "wss://iclass-saas.api.qcloud.com/connection/websocket",
  wsChannel: "public:news",
  wsToken: "553b9d161be673699d90e8059944489c",

  sendPassword: "",
  receivePassword: "",
};

/** Cos实例 */
export const CosInstance = new COS({
  async getAuthorization(options, callback) {
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
