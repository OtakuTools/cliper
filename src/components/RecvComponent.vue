<template>
  <div>
    <el-button @click="addChannel('1234')">添加频道</el-button>
    <el-tabs>
      <el-tab-pane v-for="channel in channelIdList" v-bind:key="channel">
        <recv-list-component :channelInfo="channel" :recvFileList="recvDataList.get(channel)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, } from "vue";
import RecvListComponent from "./RecvListComponent.vue";
import Socket from "../socket";

export default defineComponent({
  name: "RecvComponent",
  components: {
    RecvListComponent
  },
  props: {
    channelInfo: Object,
    recvFileList: Array
  },
  setup() {
    const data = reactive({
      channelIdList: [] as string[],
      channelWsList: new Map(),
      recvDataList: new Map()
    });

    return {
      ...toRefs(data)
    }
  },

  methods: {
    addChannel(channelId: string) {
      if (this.channelIdList.includes(channelId)) {
        return;
      }
      this.recvDataList.set(channelId, [])
      const ws = new Socket(channelId, (msg: any) => {
        const data = this.recvDataList.get(channelId);
        data.push(...msg);
      })
      this.channelWsList.set(channelId, ws);
      this.channelIdList.push(channelId);
    },

    removeChannel(channelId: string) {
      if (!this.channelIdList.includes(channelId)) {
        return;
      }
      this.recvDataList.delete(channelId)
      this.channelWsList.delete(channelId);
      this.channelIdList = this.channelIdList.filter(id => id !== channelId);
    }
  }
})
</script>