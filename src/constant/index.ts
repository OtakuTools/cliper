/** 
 * @module constant
 */

/** 是否在electron环境 */
export const isElectron = !!process.env.IS_ELECTRON;

/** 是否在extension环境 */
export const isExtension = !!process.env.IS_EXTENSION;

/** 是否在一般浏览器环境 */
export const isBrowser = !!(!isElectron && typeof window !== 'undefined');

/** 是否是开发环境 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/** 用户设定库 */
export const USER_SETTING_KEY = 'userSetting';

/** 更新历史数据信号 */
export const UPDATE_HISTORY_KEY = 'updateHistoy';

/** 历史记录库 */
export const HISTORY_RECORD_KEY = 'historyRecord';

export enum EVENT {
  CALL_RESEND = 'CALL_RESEND',
  RESEND = 'RESEND',
  DOWNLOAD = 'DOWNLOAD',
  PAGE_DATA = 'PAGE_DATA',
  /** 使用gui输入文件夹路径 */
  INPUT_DOWNLOAD_PATH = 'INPUT_DOWNLOAD_PATH',
  /** 获取用户名 */
  GET_SYSTEM_NAME = 'GET_SYSTEM_NAME',
  /** 发送系统通知 */
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
  /** 关闭系统通知 */
  CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION',
}

export type EventName = EVENT;

type FeatureName =
  | 'NOTIFICATION'
  | 'INIT_DEFAULT_SETTING';
/** feature flags */
export const FEATURE_FLAGS: Record<FeatureName, boolean> = {
  INIT_DEFAULT_SETTING: true,
  NOTIFICATION: true,
};
