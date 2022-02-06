import axios from "axios";
import COS from 'cos-js-sdk-v5';

/** ws配置 */
export const Config = {
  // wsServerURL: "ws://service-7xa83x7r-1259648581.sh.apigw.tencentcs.com:80/websocket",
  wsServerURL: "ws://service-g88d6nn1-1252809026.sh.apigw.tencentcs.com:80/websocket",


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
