<template>
  <div id="app">
    <img alt="Vue logo" src="../../assets/logo.png">
    <div>hello world</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'app',
  components: {
  },
  mounted (): void {
    // 设置badge
    window.chrome.browserAction.setBadgeText({ text: 'demo' })
    window.chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
  }
})
</script>

<style>
#app {
  width: 400px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
