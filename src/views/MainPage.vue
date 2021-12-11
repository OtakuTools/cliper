<template>
  <div class="home">
    <upload-component />
    <recv-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RecvComponent from "@/components/RecvComponent.vue";
import UploadComponent from "@/components/UploadComponent.vue";
export default defineComponent({
  name: "MainPage",
  components: {
    RecvComponent,
    UploadComponent,
  },
});
</script>
