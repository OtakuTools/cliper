import { createStore } from "vuex";
import { ref, watchEffect } from 'vue'
import { ElMessage, MessageHandle } from 'element-plus'
export * from './electorn-store'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});

// 离线(含ws断开)提醒逻辑
// FIXME: 由于ws不是单例, 如果部分ws断开就会触发提醒, 如果只有部分ws重连成功(未实现), 则状态错误
/** 是否在线 */
export const isOnline = ref(navigator.onLine)
window.addEventListener('online', () => {
  isOnline.value = true
})
window.addEventListener('offline', () => {
  isOnline.value = false
})
let message: MessageHandle | null = null
watchEffect(() => {
  if(isOnline.value){
    message?.close()
    message = null
  } else {
    message = ElMessage({
      message: 'You are offline',
      type: 'warning',
      showClose: true,
      duration: 0
    })
  }
})
