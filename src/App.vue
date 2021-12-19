<template>
  <el-menu
    default-active="1"
    class="el-menu-nav"
    mode="horizontal"
    @select="handleSelect"
    :ellipsis="false"
  >
    <el-menu-item index="1" style="width: 50%; height: 40px">
      <svg class="icon" width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594=""><path fill="currentColor" d="M160 832h704a32 32 0 110 64H160a32 32 0 110-64zm384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248L544 253.696z"></path></svg>
    </el-menu-item>
    <el-menu-item index="2" style="width: 50%; height: 40px">
      <svg class="icon" width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594=""><path fill="currentColor" d="M160 832h704a32 32 0 110 64H160a32 32 0 110-64zm384-253.696l236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"></path></svg>
    </el-menu-item>
  </el-menu>
  <div style="height: 300px; overflow-y: auto;">
    <router-view v-slot="{ Component }">
      <keep-alive include="SendPage,RecvPage">
        <component :is="Component" style="margin-top: 4px;" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainPage",
  methods: {
    handleSelect(index: string) {
      console.log(index);
      if (index === '1') {
        this.$router.push({
          path: '/sendpage'
        })
      } else {
        this.$router.push({
          path: '/recvpage'
        })
      }
    }
  }
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
