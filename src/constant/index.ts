/** 
 * @module constant
 */

/** 是否在electron环境 */
export const isElectron = !!process.env.IS_ELECTRON;

/** 是否在一般浏览器环境 */
export const isBrowser = !!(!isElectron && typeof window !== 'undefined');

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
  // 返回gui选择的路径
  INPUT_DOWNLOAD_PATH = 'INPUT_DOWNLOAD_PATH',
  // 请求gui选择文件路径
  REQUEST_DOWNLOAD_PATH = 'REQUEST_DOWNLOAD_PATH' 
}

export type EventName = EVENT;