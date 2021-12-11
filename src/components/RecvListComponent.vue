<template>
  <card>
    <div style="border: 1px solid black" v-for="data in recvFileList" v-bind:key="data.name" @click="downloadData(data)">
      <span>{{ data.name }}</span>&nbsp;
      <span>{{ data.size }}</span>&nbsp;
      <span>{{ data.timestamp }}</span>&nbsp;
    </div>
  </card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from 'electron';

export default defineComponent({
  name: "RecvListComponent",
  props: {
    channelInfo: String,
    recvFileList: Array
  },

  methods: {
    downloadData(file: any) {
      if (file.type === 'text') {
        navigator.clipboard.writeText(file.data);
      } else {
        ipcRenderer.send('download', JSON.stringify({
          downloadUrl: file.data
        }));
      }
    }
  }
})
</script>