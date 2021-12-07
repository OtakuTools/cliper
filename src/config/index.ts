import axios from "axios";

export const Config = {
  wsServerURL: "wss://iclass-saas.api.qcloud.com/connection/websocket",
  wsChannel: "public:news",
  wsToken: "553b9d161be673699d90e8059944489c",

  sendPassword: "",
  receivePassword: "",
};

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
