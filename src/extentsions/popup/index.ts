import { createApp } from 'vue';
// import App from './App.vue';
import App from '@/App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from "@/router";
import store from "@/store";

const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus);

app.config.globalProperties.chrome = window.chrome; // eslint-disable-line

app.mount('#app')
