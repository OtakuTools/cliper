/** 
 * @module constant
 */

/** 是否在electron环境 */
export const isElectron = !!process.env.IS_ELECTRON;

/** 是否在一般浏览器环境 */
export const isBrowser = !!(!isElectron && window);

/** 用户设定库 */
export const USER_SETTING_KEY = 'userSetting';

/** 更新历史数据信号 */
export const UPDATE_HISTORY_KEY = 'updateHistoy';

/** 历史记录库 */
export const HISTORY_RECORD_KEY = 'historyRecord';