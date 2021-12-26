<template>
  <card>
    <div class="data_container" v-for="data in recvFileList" v-bind:key="data.name" @click="downloadData(data)">
      <div class="data_text">{{ data.name }}</div>
      <div class="data_info">
        <span class="data_size">大小：{{ (data.size / 1000).toFixed(2) + 'KB' }}</span>
        <span class="data_time">时间：{{ formatDate(data.timestamp) }}</span>
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
}

.data_info > span {
  margin: 4px;
}

.data_size {
  width: 20px;
  margin-left: 0 !important;
}

.data_time {
  width: 20px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { bridge } from '../store'
import dayjs from 'dayjs';
import { EVENT } from "@/constant";

export default defineComponent({
  name: "RecvListComponent",
  props: {
    channelInfo: String,
    recvFileList: Array
  },

  setup() {
    const formatDate = (timestamp: number) => {
      return dayjs(timestamp).format('MM-DD HH:mm:ss');
    }

    const downloadData = (file: any) => {
      if (file.type === 'text') {
        navigator.clipboard.writeText(file.data);
      } else {
        bridge.send(EVENT.DOWNLOAD, JSON.stringify({
          downloadUrl: file.data,
          name: file.name
        }));
      }
    }

    return {
      formatDate,
      downloadData
    }
  }
})
</script>