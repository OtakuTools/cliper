<template>
  <div class="home">
    <ClipContentList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClipContentList from "@/components/ClipContentList.vue";
export default defineComponent({
  name: "MainPage",
  components: {
    ClipContentList,
  },
});
</script>
