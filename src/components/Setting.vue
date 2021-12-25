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
        <DirectoryInput v-model="downloadPath" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import DirectoryInput from "./DirectoryInput.vue";
import { userSetting } from "../store";

export default defineComponent({
  components: { DirectoryInput },
  name: "Setting",
  setup() {
    return {
      ...toRefs(userSetting),
    };
  },
});
</script>
