<template>
  <div style="margin: 16px;">
    <el-form
      label-position="right"
      label-width="80px"
    >
      <el-form-item label="频道号">
        <el-input v-model="roomId"></el-input>
      </el-form-item>
      <el-form-item label="频道密码">
        <el-input v-model="roomPsw"></el-input>
      </el-form-item>
      <el-form-item label="下载路径">
        <el-input v-model="downloadPath"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import Store from "electron-store"

const store = new Store();

export default defineComponent({
  name: "Setting",
  setup() {
    const prevData : any = store.get('userSetting');

    const data = reactive({
      roomId: prevData?.roomId || '',
      roomPsw: prevData?.roomPsw || '',
      downloadPath: prevData?.downloadPath || ''
    });

    watch(() => data, () => {
      store.set('userSetting.roomId', data.roomId);
      store.set('userSetting.roomPsw', data.roomPsw);
      store.set('userSetting.downloadPath', data.downloadPath);
    }, { deep: true })

    return {
      ...toRefs(data),
    };
  },
});
</script>
