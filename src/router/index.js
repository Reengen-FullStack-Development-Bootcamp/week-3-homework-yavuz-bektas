import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/symbol",
    name: "Symbol",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Symbol.vue"),
  },
  {
    path: "/logs",
    name: "Logs",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Logs.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const ısItAdmin = localStorage.getItem("areyouadmin");
  if (to.name === "Logs" && ısItAdmin === "user") {
    const Paths = "Route changed from " + from.path + " to " + to.path;
    const today = new Date();
    const yearMonthDay =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const HourMin =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const who = localStorage.getItem("areyouadmin");
    const AllDatas = {
      Paths,
      yearMonthDay,
      HourMin,
      who,
    };
    store.commit("setPathFollow", AllDatas);
    alert("You are not authorized!!");
    next({ name: "Home" });
  } else next();
});

export default router;
