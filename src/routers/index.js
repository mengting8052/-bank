import Vue from "vue"
import VueRouter from "vue-router"
import GvtLayouts from "../components/layouts"
import Console from "../views/console"
import Login from "../views/auth/Login"
import * as ErrorViews from "../views/errors"
import productRouter from "./product"
import filingRouter from "./filing"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "root",
    component: GvtLayouts,
    redirect: {name: "console"},
    children: [
      {
        path: "console",
        name: "console",
        component: Console,
        meta: {
          icon: "icon-mywork",
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/403",
    name: "403",
    component: ErrorViews.Gvt403Error,
    meta: {
      title: "403"
    },
  },
  {
    path: "/404",
    name: "404",
    component: ErrorViews.Gvt404Error,
    meta: {
      title: "404"
    },
  },
  {
    path: "/500",
    name: "500",
    component: ErrorViews.Gvt500Error,
    meta: {
      title: "500"
    },
  },

  // 商品管理
  productRouter,
  // 备案管理
  filingRouter,

  {
    path: "*",
    redirect: {name: "404"},
  }
]

export default new VueRouter({
  mode: "hash",
  scrollBehavior: () => ({ y: 0 }),
  routes
})

