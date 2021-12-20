<template>
  <div class="settings">
    <setting />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Setting from "@/components/Setting.vue";
export default defineComponent({
  name: "SettingPage",
  components: {
    Setting,
  },
});
</script>
