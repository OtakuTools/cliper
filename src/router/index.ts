import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import SendPage from "../views/SendPage.vue";
import RecvPage from "../views/RecvPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/sendpage",
    name: "SendPage",
    component: SendPage,
  },
  {
    path: "/recvpage",
    name: "RecvPage",
    component: RecvPage,
  },
  {
    path: "/",
    redirect: '/sendpage'
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
