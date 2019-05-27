import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from "./vuex/store"
import Auth from "./utils/auth"
import * as filters from "./filters"
import VueBus from "./utils/bus"
import Lang from "./utils/lang"
import iView from "iview"
import HeroUI from "gvt-hero"
import GvtPage from "./components/page"
import GvtLayout from "./components/layout"
import { i18n, setI18nLanguage } from "./setup/i18n-setup"

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(HeroUI)
Vue.use(VueBus)
Vue.use(GvtPage)
Vue.use(GvtLayout)

const cleanLangAndTokenQuery = (to, from , next) => {
  to.query.token && delete to.query.token
  if(to.query.lang) {
    delete to.query.lang
    if(from.path === to.path) {
      iView.LoadingBar.finish()
    }
    next({
      // 替换当前路由地址
      replace: true,
      path: to.path,
      params: to.params,
      query: to.query
    });
  } else {
    next();
  }
}

const accessRoutePath = ["/login", "/403", "/404", "/500"];

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();

  if(to.query.lang) {
    // query.lang 存在时, 更新本地 lang
    Lang.setLang(to.query.lang)
  } else {
    // 若 query.lang 不存在, 且本地未缓存语种时, 默认将其置为 "zh-CN"
    !Lang.getLang() && Lang.setLang()
  }

  // 初始化 vue-i18n locale
  setI18nLanguage(Lang.getLang())

  // query.token 存在时, 更新本地 jwt
  if(to.query.token) {
    Auth.setToken(to.query.token)
  }

  if(Auth.getToken()) {
    if(to.path === "/login") {
      next({path: "/"});
      iView.LoadingBar.finish();
    } else {
      if(store.getters.user.id === ""){
        store.dispatch("FetchUserData").then(apps => {
          store.dispatch("InitPermissionByApps", apps).then(() => {
            cleanLangAndTokenQuery(to, from, next)
          })
        }).catch(error => {
          Auth.removeToken();
          if(error.source && error.source === "action") {
            next({ path: `/${error.redirect}` });
          } else {
            next({ path: "/login" })
          }
        })
      }else{
        cleanLangAndTokenQuery(to, from, next)
      }
    }
  }else {
    if(accessRoutePath.indexOf(to.path) > -1) {
      cleanLangAndTokenQuery(to, from, next)
    }else {
      next({path: "/login"});
      iView.LoadingBar.finish();
    }
  }
});

router.afterEach(router => {
  iView.LoadingBar.finish();
});

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});