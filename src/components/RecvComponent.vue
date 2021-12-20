<template>
  <div>
    <!-- <el-button @click="addChannel('1234')">添加频道</el-button> -->
    <el-tabs editable @edit="handleChannelEdit" v-model="currentChannel">
      <el-tab-pane :label="channel.split('_')[0]" v-for="channel in channelIdList" v-bind:key="channel" :name="channel">
        <recv-list-component :channelInfo="channel" :recvFileList="recvDataList.get(channel)" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogFormVisible" title="添加频道" width="80%" :show-close="false" fullscreen>
    <el-form :model="channelForm" label-width="80px">
      <el-form-item label="频道号">
        <el-input v-model="channelForm.roomId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="频道密码">
        <el-input v-model="channelForm.roomPsw" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, } from "vue";
import RecvListComponent from "./RecvListComponent.vue";
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
      currentChannel: '',
      dialogFormVisible: false,
      channelForm: {
        roomId: '',
        roomPsw: ''
      }
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
        this.dialogFormVisible = true;
      }
      if (action === 'remove') {
        this.removeChannel(targetName)
      }
    },

    handleDialogConfirm() {
      this.dialogFormVisible = false;
      this.addChannel(this.channelForm.roomId + '_' + this.channelForm.roomPsw)
      this.channelForm = {
        roomId: '',
        roomPsw: ''
      }
    }
  }
})
</script>