import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import SendPage from "../views/SendPage.vue";
import RecvPage from "../views/RecvPage.vue";
import HistoryPage from "../views/HistoryPage.vue";
import SettingPage from "../views/SettingPage.vue";

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

const history = process.env.NODE_ENV === 'production' && process.env.IS_ELECTRON
    ? createWebHashHistory(process.env.BASE_URL)
    : createWebHistory(process.env.BASE_URL)

const router = createRouter({
  history,
  routes,
});

export default router;
