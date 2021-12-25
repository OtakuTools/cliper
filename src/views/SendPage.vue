<template>
  <div class="home">
    <upload-component :channelId="mergedChannelId" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import UploadComponent from "@/components/UploadComponent.vue";
import { settingChannel } from '../store'

export default defineComponent({
  name: "SendPage",
  components: {
    UploadComponent,
  },
  props: {
    channelId: {
      type: String,
      default: '',
    }
  },
  setup(props) {
    return {
      mergedChannelId: computed(() => props.channelId || settingChannel.value)
    }
  }
});
</script>

<style scoped>
.home {
  overflow: hidden;
}
</style>
