<template>
  <div class="home">
    <upload-component />
    <ClipContentList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClipContentList from "@/components/ClipContentList.vue";
import UploadComponent from "@/components/UploadComponent.vue";
export default defineComponent({
  name: "MainPage",
  components: {
    ClipContentList,
    UploadComponent,
  },
});
</script>
