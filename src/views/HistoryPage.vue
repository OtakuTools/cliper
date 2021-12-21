<template>
  <div class="settings">
    <history-record-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HistoryRecordComponent from "../components/HistoryRecordComponent.vue"
export default defineComponent({
  name: "HistoryPage",
  components: {
    HistoryRecordComponent
  }
});
</script>