import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import SendPage from "../views/SendPage.vue";
import RecvPage from "../views/RecvPage.vue";
import HistoryPage from "../views/HistoryPage.vue";
import SettingPage from "../views/SettingPage.vue";
import { isExtension, isElectron, isDevelopment } from '../constant'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/sendpage",
    name: "SendPage",
    component: SendPage,
    props: route => ({ channelId: route.query.channelId })
  },
  {
    path: "/recvpage",
    name: "RecvPage",
    component: RecvPage,
  },
  {
    path: "/historypage",
    name: "HistoryPage",
    component: HistoryPage,
  },
  {
    path: "/settingpage",
    name: "SettingPage",
    component: SettingPage,
  },
  {
    path: "",
    redirect: '/sendpage'
  },
];

console.log(process.env.BASE_URL, location.href);

const history = !isDevelopment && isElectron
    ? createWebHashHistory(process.env.BASE_URL)
    : isExtension ?
      createWebHashHistory(location.href)
    : createWebHistory(process.env.BASE_URL)

const router = createRouter({
  history,
  routes,
});

export default router;
