<template>
  <div class="settings">
    <Settings />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Settings from "@/components/Settings.vue";
export default defineComponent({
  name: "UserSettings",
  components: {
    Settings,
  },
});
</script>
