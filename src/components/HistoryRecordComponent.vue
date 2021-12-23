<template>
  <card>
    <div class="data_container" v-for="data in historyFile" v-bind:key="data.name">
      <div class="data_text">{{ data.name }}</div>
      <div class="data_info">
        <span class="data_size">大小：{{ (data.size / 1000).toFixed(2) + 'KB' }}</span>
        <span class="data_time">时间：{{ formatDate(data.timestamp) }}</span>
        <el-button class="data_icon" type="text" @click="resend(data)">重新发送</el-button>
      </div>
    </div>
  </card>
</template>

<style scoped>
.data_container {
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  width: 360px;
  padding: 4px 0;
}

.data_text {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden; 
}

.data_info {
  color: #888;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
}

.data_info > span {
  margin: 4px;
}

.data_size {
  width: 80px;
  margin-left: 0 !important;
}

.data_time {
  flex: 1;
}

.data_icon {
  min-height: 12px !important;
  padding: 0;
  font-size: 12px;
  width: 60px;
}
</style>

<script lang="ts">
import { defineComponent, onActivated, reactive, toRefs } from "vue";
import { ipcRenderer } from 'electron';
import dayjs from 'dayjs';
import Store from 'electron-store';
import { useRoute } from "vue-router";

const store = new Store();

export default defineComponent({
  name: "HistoryRecordComponent",

  setup() {
    const data = reactive({
      historyFile: [] as any
    })

    onActivated(() => {
      const route = useRoute()
      const needUpdate = route.query.needUpdate;
      if (needUpdate) {
        data.historyFile = store.get('historyRecord', []);
        store.set('historyUpdate', false)
      }
    })
    
    const resend = (msg: any) => {
      ipcRenderer.send('resend', JSON.stringify([msg]));
    }

    const formatDate = (timestamp: number) => {
      return dayjs(timestamp).format('MM-DD HH:mm:ss')
    }

    return {
      ...toRefs(data),
      resend,
      formatDate
    }
  }
})
</script>