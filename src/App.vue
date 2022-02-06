<template>
  <el-menu
    :default-active="currentRoute"
    class="el-menu-nav"
    mode="horizontal"
    @select="handleSelect"
    :ellipsis="false"
  >
    <el-menu-item index="SendPage" style="height: 40px; width: 25%">
      <svg
        class="icon"
        width="24"
        height="24"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M160 832h704a32 32 0 110 64H160a32 32 0 110-64zm384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248L544 253.696z"
        ></path>
      </svg>
    </el-menu-item>
    <el-menu-item index="RecvPage" style="height: 40px; width: 25%">
      <svg
        class="icon"
        width="24"
        height="24"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M160 832h704a32 32 0 110 64H160a32 32 0 110-64zm384-253.696l236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"
        ></path>
      </svg>
    </el-menu-item>
    <el-menu-item index="HistoryPage" style="height: 40px; width: 25%">
      <svg
        class="icon"
        width="24"
        height="24"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M512 160c194.410667 0 352 157.589333 352 352S706.410667 864 512 864l-2.538667-0.106667c-91.477333-7.274667-165.738667-38.08-221.44-91.989333L288 842.666667h-64V640H405.333333v64h-92.842666c46.250667 56.917333 112.490667 88.725333 200.768 96l6.677333-0.106667C675.328 795.690667 800 668.394667 800 512c0-159.061333-128.938667-288-288-288S224 352.938667 224 512h-64c0-194.410667 157.589333-352 352-352zM469.333333 320h64v160h160v64H469.333333V320z"
          p-id="6677"
        ></path>
      </svg>
    </el-menu-item>
    <el-menu-item index="SettingPage" style="height: 40px; width: 25%">
      <svg
        class="icon"
        width="24"
        height="24"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M448.362667 166.826667l113.6 0.170666a64 64 0 0 1 63.893333 63.914667l0.042667 18.517333a301.461333 301.461333 0 0 1 62.101333 34.88l15.210667-8.746666a64 64 0 0 1 87.296 23.381333l56.938666 98.304a64 64 0 0 1-19.989333 85.397333l-3.477333 2.133334-15.274667 8.810666c2.624 24.234667 2.304 48.853333-1.130667 73.322667l10.794667 6.250667a64 64 0 0 1 25.216 84.117333l-1.770667 3.306667-53.333333 92.373333a64 64 0 0 1-84.117333 25.216l-3.328-1.792-14.741334-8.533333a298.538667 298.538667 0 0 1-59.626666 33.28v25.386666a64 64 0 0 1-59.989334 63.957334l-4.074666 0.128-113.6-0.170667a64 64 0 0 1-63.893334-63.893333l-0.064-30.613334a302.613333 302.613333 0 0 1-50.069333-29.696l-27.221333 15.658667a64 64 0 0 1-87.296-23.402667l-56.938667-98.282666a64 64 0 0 1 19.989333-85.418667l3.477334-2.133333 27.690666-15.936c-2.133333-20.266667-2.24-40.768-0.192-61.226667l-30.741333-17.770667A64 64 0 0 1 158.506667 393.6l1.792-3.306667 53.333333-92.373333a64 64 0 0 1 84.117333-25.216l3.306667 1.792 26.794667 15.466667a297.984 297.984 0 0 1 56.426666-34.666667v-24.362667a64 64 0 0 1 59.989334-63.978666l4.074666-0.128z m-0.085334 64l0.064 65.066666-36.778666 17.301334c-15.744 7.402667-30.613333 16.533333-44.309334 27.221333l-34.005333 26.538667-62.570667-36.138667-1.6-0.896-53.333333 92.373333 66.56 38.421334-4.138667 41.152c-1.6 15.978667-1.536 32.106667 0.149334 48.085333l4.394666 41.429333-63.786666 36.736 56.917333 98.282667 63.338667-36.416 33.6 24.597333a237.994667 237.994667 0 0 0 39.466666 23.424l36.736 17.258667 0.128 71.168 113.578667 0.170667-0.064-68.16 39.466667-16.426667a234.538667 234.538667 0 0 0 46.826666-26.112l33.578667-24.128 50.56 29.184 53.290667-92.394667-48.128-27.818666 5.973333-42.688c2.666667-19.093333 2.965333-38.421333 0.896-57.6l-4.48-41.450667 51.456-29.696-56.938667-98.282667-51.2 29.504-33.621333-24.512a238.037333 238.037333 0 0 0-48.938667-27.498666l-39.381333-16.341334-0.128-61.184-113.578667-0.170666z m127.381334 183.722666a128.170667 128.170667 0 0 1 46.890666 174.933334 127.829333 127.829333 0 0 1-174.762666 46.848 128.170667 128.170667 0 0 1-46.869334-174.933334 127.829333 127.829333 0 0 1 174.741334-46.848z m-119.317334 78.805334a64.170667 64.170667 0 0 0 23.466667 87.573333 63.829333 63.829333 0 0 0 87.296-23.402667 64.170667 64.170667 0 0 0-20.266667-85.589333l-3.2-1.984-3.306666-1.770667a63.829333 63.829333 0 0 0-83.989334 25.173334z"
        ></path>
      </svg>
    </el-menu-item>
  </el-menu>
  <div style="height: 300px; overflow-y: auto">
    <router-view v-slot="{ Component }">
      <keep-alive include="SendPage,RecvPage,HistoryPage,SettingPage">
        <component :is="Component" style="margin-top: 4px" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { updateHistory } from "./store";
import { bridge } from "./event";
import { SocketEvent, SocketManager } from "./socket/socket-manager";

export default defineComponent({
  name: "MainPage",
  setup() {
    const router = useRouter();
    function handleSelect(index: string) {
      const needUpdate = updateHistory.value;
      router.push({
        name: index,
        query: {
          needUpdate: needUpdate.toString(),
        },
      });
    }

    const route = useRoute();
    const currentRouteRef = computed(() => route.name);

    // ws通道管理器
    const socketManager = new SocketManager(bridge);

    bridge.on(SocketEvent.CREATE_INSTANCE, (evt, args) => {
      console.log("SocketEvent.CREATE_INSTANCE", args);
      const channelId = args[0];
      socketManager.createInstance(channelId);
    });

    bridge.on(SocketEvent.SEND_MSG, (evt, args) => {
      console.log("SocketEvent.SEND_MSG", args);
      const [channelId, messageList] = args;
      socketManager.sendMessage(channelId, messageList);
    });

    bridge.on(SocketEvent.DELETE_INSTANCE, (evt, args) => {
      console.log("SocketEvent.SEND_MSG", args);
      const channelId = args[0];
      socketManager.deleteInstance(channelId);
    });

    return {
      currentRoute: currentRouteRef,
      handleSelect,
    };
  },
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  min-width: 360px;
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
