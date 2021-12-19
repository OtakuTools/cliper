<template>
  <div class="home">
    <recv-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RecvComponent from "@/components/RecvComponent.vue";
export default defineComponent({
  name: "RecvPage",
  components: {
    RecvComponent,
  },
});
</script>
