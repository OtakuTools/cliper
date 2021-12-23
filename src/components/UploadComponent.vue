<template>
  <div>
    <el-upload
      ref="uploader"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :auto-upload="false"
      :file-list="fileList"
      :on-change="uploadFileChange"
      :on-remove="removeFileChange"
      style="width: 360px;"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <span class="el-upload__msg">
            jpg/png files with a size less than 500kb
          </span>
          <el-button
            class="el-upload__btn"
            size="small"
            type="success"
            @click="submitUpload"
            >Send</el-button
          >
        </div>
      </template>
    </el-upload>
  </div>
</template>

<style scoped>
.el-upload__tip {
  display: flex;
}

.el-upload__msg {
  flex: 1;
  line-height: 32px;
  height: 32px;
}

.el-upload__btn {
  width: 60px;
  margin-left: 10px;
}
</style>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, onActivated, watch } from "vue";
import { UploadFilled } from '@element-plus/icons-vue';
import { Config, CosInstance } from "../config";
import Socket, { SocketMessage } from '../socket';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import { useRoute } from "vue-router";

const store = new Store();

export default defineComponent({
  name: "UploadComponent",
  components: {
    UploadFilled,
  },
  setup() {
    const data = reactive({
      fileList: [] as any[],
      channelId: '',
      ws: null as any as Socket
    });


    /** 
     * @function 添加到待发送列表
     * @param {any} newData
     */
    function addToFileList(newData: any) {
      const isUnique = data.fileList.findIndex((item: any) => item.name === newData.name) === -1;
      if (isUnique) {
        data.fileList.push(newData);
      }
    }

    watch(() => data.channelId, (cid: string) => {
      data.ws = new Socket(cid, (data) => { console.log(data) })
    })

    onActivated(() => {
      const route = useRoute();
      data.channelId = route.query.channelId as string;
    })

    onMounted(() => {

      // 监听粘贴操作并将粘贴项添加到待发送列表
      document.addEventListener(
        "paste",
        (event) => {
          for (let entity of event.clipboardData?.items || []) {
            // 仅粘贴纯文本
            if (entity.kind === "string" && entity.type === 'text/plain') {
              entity.getAsString((message) => {
                addToFileList({
                  type: 'text',
                  name: message,
                  percentage: 0,
                  status: 'ready',
                  size: message.length,
                  raw: message
                })
              });
            } else if (entity.kind === "file") {
              let file = entity.getAsFile();
              if (file) {
                addToFileList({
                  name: file.name,
                  percentage: 0,
                  status: 'ready',
                  size: file.size,
                  raw: file
                })
              }
            }
          }
        },
        { capture: false }
      );
    });

    function putObject(fileObj: File | string): Promise<SocketMessage> {
      if (typeof fileObj === 'string') {
        return new Promise((resolve) => {
          resolve({
            name: fileObj,
            type: 'text',
            data: fileObj,
            size: fileObj.length,
            timestamp: Date.now()
          })
        })
      }
      return new Promise((resolve) => {
        CosInstance.putObject(
          {
            Bucket: "file-transfer-1252809026" /* 必须 */,
            Region: "ap-guangzhou" /* 存储桶所在地域，必须字段 */,
            Key: fileObj.name /* 必须 */,
            StorageClass: "STANDARD",
            Body: fileObj, // 上传文件对象
          },
          (err: unknown, data: any) => {
            if (!err) {
              let resUrl = 'https://' + data.Location;
              resolve({
                name: fileObj.name,
                type: 'url',
                data: resUrl,
                size: fileObj.size,
                timestamp: Date.now()
              })
            }
          }
        );
      })
    }

    /** @function 通过ws同步消息 */
    function sendMessage(message: SocketMessage[]): Promise<unknown> {
      console.log(message);
      data.ws.socketSend(message);
      return Promise.resolve(null);
    }

    /** 点击发送按钮 */
    function submitUpload() {
      const promiseQue = data.fileList.map(file => putObject(file.raw))
      Promise.all(promiseQue).then(res => {
        sendMessage(res);
        const history: any = store.get('historyRecord', []);
        store.set('historyRecord', res.concat(history));
        store.set('historyUpdate', true);
        data.fileList = [];
      })
    }

    // 移除项
    function removeFromFileList(target: any) {
      data.fileList = data.fileList.filter((item: any) => item.name !== target.name)
    }
    function removeFileChange(file: any, fileList: any) {
      removeFromFileList(file);
    }

    function uploadFileChange(file: any, fileList: any) {
      addToFileList(file);
    }

    ipcRenderer.on('callResend', (evt, args) => {
      const data = JSON.parse(args);
      sendMessage(data);
    })

    return {
      ...toRefs(data),
      submitUpload,
      removeFileChange,
      uploadFileChange,
    };
  }
});
</script>