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
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { ipcRenderer } from "electron";
import { Config, CosInstance } from "../config";
import Centrifuge from "centrifuge";

export default defineComponent({
  name: "ClipContentList",
  setup() {
    const data = reactive({
      clipContentList: [] as string[],
      currentUser: "test1234",
    });

    const centrifuge = new Centrifuge(Config.wsServerURL);
    centrifuge.setConnectData({
      user_id: data.currentUser,
      new_enter_id: 1789317,
      token: Config.wsToken,
    });

    function addToClipContentList(title: string): void {
      if (!data.clipContentList.includes(title)) {
        data.clipContentList.push(title);
      }
    }

    // 订阅ws
    centrifuge.subscribe(Config.wsChannel, function (message) {
      const remoteData = message.data;
      const sender = remoteData.sender;
      const content = remoteData.content;
      if (sender === data.currentUser) {
        addToClipContentList(content.text);
      }
    });

    function sendMessage(message: unknown): Promise<unknown> {
      return centrifuge
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
    }

    function clipboardListAddItem(title: string, message: unknown) {
      addToClipContentList(title);
      sendMessage(message);
    }

    function putObject(fileObj: File) {
      CosInstance.putObject(
        {
          Bucket: "file-transfer-1252809026" /* 必须 */,
          Region: "ap-guangzhou" /* 存储桶所在地域，必须字段 */,
          Key: fileObj.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: fileObj, // 上传文件对象
          // onProgress: (progressData) => {
          //   if (progressData.percent === 1) {
          //     // 上传完成
          //   }
          // },
        },
        (err: unknown, data: any) => {
          if (!err) {
            let resUrl = data.Location;
            console.log("resUrl", resUrl);
            clipboardListAddItem(resUrl, { text: resUrl });
          }
        }
      );
    }

    onMounted(() => {
      document.addEventListener(
        "paste",
        (event) => {
          console.group("paste");
          console.log("event", event);
          console.log("clipboardData", event.clipboardData);
          console.log("items", event.clipboardData?.items);
          console.log("types", event.clipboardData?.types);
          console.log("fileList", event.clipboardData?.files);
          console.log("getData", event.clipboardData?.getData("Files"));

          let kinds: string[] = [];
          for (let item of event.clipboardData?.items || []) {
            kinds.push(item.kind);
          }
          console.log("kinds", kinds);

          console.groupEnd();

          for (let entity of event.clipboardData?.items || []) {
            if (entity.kind === "string") {
              entity.getAsString((message) => {
                clipboardListAddItem(message, { text: message });
              });
            } else if (entity.kind === "file") {
              let file = entity.getAsFile();
              if (file) {
                putObject(file);
              }
            }
          }
        },
        { capture: false }
      );
    });

    ipcRenderer.on("pageData", function (event, message) {
      console.log("pageData", message);
      clipboardListAddItem(message.text, message);
    });

    centrifuge.connect();

    return {
      ...toRefs(data),
    };
  },
});
</script>
