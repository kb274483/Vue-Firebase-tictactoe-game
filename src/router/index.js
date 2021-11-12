import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/single",
    name: "Single",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SingleGame.vue"),
  },
  {
    path: "/double",
    name: "Double",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Double.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
