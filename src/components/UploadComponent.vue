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
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { UploadFilled } from '@element-plus/icons-vue';
import { Config, CosInstance } from "../config";
import Socket from '../socket';

export default defineComponent({
  name: "UploadComponent",
  components: {
    UploadFilled,
  },
  setup() {
    const data = reactive({
      fileList: [] as any[],
      ws: new Socket('1234', (msg: any) => { console.log(msg)}),
    });

    function addToFileList(newData: any) {
      const isUnique = data.fileList.findIndex((item: any) => item.name === newData.name) === -1;
      if (isUnique) {
        data.fileList.push(newData);
      }
    }

    onMounted(() => {
      document.addEventListener(
        "paste",
        (event) => {
          // console.group("paste");
          // console.log("event", event);
          // console.log("clipboardData", event.clipboardData);
          // console.log("items", event.clipboardData?.items);
          // console.log("types", event.clipboardData?.types);
          // console.log("fileList", event.clipboardData?.files);
          // console.log("getData", event.clipboardData?.getData("Files"));
          // console.groupEnd();

          for (let entity of event.clipboardData?.items || []) {
            if (entity.kind === "string") {
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

    return {
      ...toRefs(data),
    };
  },



  methods: {
    submitUpload() {
      const promiseQue: any = [];
      this.fileList.forEach((file: any) => {
        promiseQue.push(this.putObject(file.raw))
      })
      Promise.all(promiseQue).then(res => {
        this.sendMessage(res);
      })
    },

    sendMessage(message: unknown): Promise<unknown> {
      console.log(message)
      this.ws.socketSend(message);
      return Promise.resolve(null)
    },

    addToFileList(data: any) {
      const isUnique = this.fileList.findIndex((item: any) => item.name === data.name) === -1;
      if (isUnique) {
        this.fileList.push(data);
      }
    },

    removeFromFileList(data: any) {
      this.fileList = this.fileList.filter((item: any) => item.name !== data.name)
    },

    uploadFileChange(file: any, fileList: any) {
      this.addToFileList(file);
    },

    removeFileChange(file: any, fileList: any) {
      this.removeFromFileList(file);
    },

    putObject(fileObj: File | string) {
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
  }
});
</script>