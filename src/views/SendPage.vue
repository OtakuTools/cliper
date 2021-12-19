<template>
  <div class="home">
    <upload-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UploadComponent from "@/components/UploadComponent.vue";
export default defineComponent({
  name: "SendPage",
  components: {
    UploadComponent,
  },
});
</script>

<style scoped>
.home {
  overflow: hidden;
}
</style>
