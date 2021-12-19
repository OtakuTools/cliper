<template>
  <div>
    <!-- <el-button @click="addChannel('1234')">添加频道</el-button> -->
    <el-tabs editable @edit="handleChannelEdit" v-model="currentChannel">
      <el-tab-pane :label="channel" v-for="channel in channelIdList" v-bind:key="channel" :name="channel">
        <recv-list-component :channelInfo="channel" :recvFileList="recvDataList.get(channel)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, } from "vue";
import RecvListComponent from "./RecvListComponent.vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import Socket, { SocketMessage } from "../socket";

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
      channelWsList: new Map<string, Socket>(),
      recvDataList: new Map<string, SocketMessage[]>(),
      currentChannel: ''
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
      const ws = new Socket(channelId, (msg: SocketMessage[]) => {
        const data = this.recvDataList.get(channelId) || [];
        data.push(...msg);
      })
      this.channelWsList.set(channelId, ws);
      this.channelIdList.push(channelId);
      this.currentChannel = channelId;
    },

    removeChannel(channelId: string) {
      if (!this.channelIdList.includes(channelId)) {
        return;
      }
      this.recvDataList.delete(channelId)
      const ws = this.channelWsList.get(channelId);
      ws?.close();
      this.channelWsList.delete(channelId);
      if (channelId === this.currentChannel) {
        const index = this.channelIdList.findIndex(id => id === channelId);
        this.currentChannel = this.channelIdList[index - 1] || this.channelIdList[index + 1] || '';
      }
      this.channelIdList = this.channelIdList.filter(id => id !== channelId);
    },

    handleChannelEdit(targetName: string, action: string) {
      console.log('action',action,targetName)
      if (action === 'add') {
        ElMessageBox.prompt('请输入频道号', '提示', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputPattern:
            /\d+/,
          inputErrorMessage: '非法频道号',
        })
        .then(({ value }) => {
          this.addChannel(value)
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '添加频道失败',
          })
        })
      }
      if (action === 'remove') {
        this.removeChannel(targetName)
      }
    },
  }
})
</script>