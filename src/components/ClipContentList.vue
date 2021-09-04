<template>
  <div>
    <h3>剪切板</h3>
    <ul>
      <li v-for="item in clipContentList" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { ipcRenderer } from "electron";
import { Config } from "../config";
import Centrifuge from "centrifuge";


export default defineComponent({
  name: "ClipContentList",
  setup() {
    const data = reactive({
      clipContentList: [] as string[],
      currentUser: 'test1234'
    });

    const centrifuge = new Centrifuge(
      Config.wsServerURL
    );
    centrifuge.setConnectData({
      user_id: data.currentUser,
      new_enter_id: 1789317,
      token: Config.wsToken,
    });

    centrifuge.subscribe(Config.wsChannel, function (message) {
      const remoteData = message.data;
      const sender = remoteData.sender;
      const content = remoteData.content;
      if (sender === data.currentUser) {
        const clipText = content.text;
        if (!data.clipContentList.includes(clipText)) {
          data.clipContentList.push(content.text);
        }
      }
    });

    ipcRenderer.on("pageData", function (event, message) {
      if (!data.clipContentList.includes(message.text)) {
        data.clipContentList.push(message.text);
      }
      centrifuge
        .namedRPC("send_message", {
          channel: Config.wsChannel,
          client_ts: `${Date.now()}`,
          content: message,
        })
        .then(
          function (res) {
            console.log("rpc result", res);
          },
          function (err) {
            console.log("rpc error", err);
          }
        );
    });

    centrifuge.connect();

    return {
      ...toRefs(data),
    };
  },
});
</script>
