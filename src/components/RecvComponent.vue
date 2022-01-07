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
import { settingChannel, formatChannelId, bridge } from '../store';
import { EVENT, FEATURE_FLAGS } from '../constant';
import Notify from '../notification';

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

    function addChannel(channelId: string) {
      if (data.channelIdList.includes(channelId)) {
        return;
      }
      data.recvDataList.set(channelId, [])
      const ws = new Socket(channelId, (msg: SocketMessage[]) => {
        const target = data.recvDataList.get(channelId) || [];
        target.push(...msg);

        // 消息推送
        if(FEATURE_FLAGS.NOTIFICATION){
          msg.filter(file => file.type === 'url').forEach(file => {
            Notify.info('收到文件, 点击下载', {
              content: file.name,
              click: () => bridge.send(EVENT.DOWNLOAD, JSON.stringify({
                downloadUrl: file.data,
                name: file.name
              }))
            })
          })
        }
      })
      data.channelWsList.set(channelId, ws);
      data.channelIdList.push(channelId);
      data.currentChannel = channelId;
    }

    function handleDialogConfirm() {
      data.dialogFormVisible = false;
      addChannel(formatChannelId(data.channelForm))
      data.channelForm = {
        roomId: '',
        roomPsw: ''
      }
    }

    function removeChannel(channelId: string) {
      if (!data.channelIdList.includes(channelId)) {
        return;
      }
      data.recvDataList.delete(channelId)
      const ws = data.channelWsList.get(channelId);
      ws?.close();
      data.channelWsList.delete(channelId);
      if (channelId === data.currentChannel) {
        const index = data.channelIdList.findIndex(id => id === channelId);
        data.currentChannel = data.channelIdList[index - 1] || data.channelIdList[index + 1] || '';
      }
      data.channelIdList = data.channelIdList.filter(id => id !== channelId);
    }

    function handleChannelEdit(targetName: string, action: string) {
      console.log('action',action,targetName)
      if (action === 'add') {
        data.dialogFormVisible = true;
      }
      if (action === 'remove') {
        removeChannel(targetName)
      }
    }

    // 默认加入发送的频道
    addChannel(settingChannel.value)

    return {
      ...toRefs(data),
      handleDialogConfirm,
      handleChannelEdit
    }
  }
})
</script>