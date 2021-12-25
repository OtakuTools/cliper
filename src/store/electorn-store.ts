/** 
 * @module electron-store
 * 持久储存层
 */
import Store from "electron-store"
import { ref, reactive, watch, computed } from "vue";
import { SocketMessage } from '../socket'
import { USER_SETTING_KEY, UPDATE_HISTORY_KEY, HISTORY_RECORD_KEY } from '../constant'

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
const store = new Store<StoreType>();

// eslint-disable-next-line @typescript-eslint/ban-types
function useStoreReactive<T extends object>(key: string, defaultValue: T) {
  const target = store.get(key, defaultValue)
  const targetRef = reactive<T>(target)
  watch(targetRef, (value) => store.set(key, value), { deep: true })
  return targetRef
}

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
export const settingChannel = computed(() => formatChannelId(userSetting))

/** 更新历史 */
export const updateHistory = useStoreRef(UPDATE_HISTORY_KEY, true);

/** 历史列表 */
export const historyRecord = useStoreRef(HISTORY_RECORD_KEY, [] as SocketMessage[]);
