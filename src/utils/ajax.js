import axios from 'axios'
import Auth from "./auth"
import Lang from "./lang"
import { routerT } from "../setup/i18n-setup"
import store from "../vuex/store"
import {
  BACKEND_DOMAIN,
  SPLITE_DOMAIN
} from "./env"

const ajax = axios.create({
  baseURL: BACKEND_DOMAIN,
  timeout: 20000,
});

ajax.defaults.headers.common["Accept-Language"] = Lang.getLang();

ajax.interceptors.request.use(config => {

  const jwt = Auth.getToken();

  const splitDomain = SPLITE_DOMAIN;
  const reg = new RegExp(`^(${splitDomain})`);

  if (!reg.test(config.baseURL)) {
    jwt && (config.headers["Authorization"] = jwt);
  }

  return config;
}, error => {
  Promise.reject(error);
});

ajax.interceptors.response.use(response => {
  const code = response.data.code;

  if(["110001", "110002", "110003", "110004", "110103"].indexOf(code) > -1) {
    store.dispatch("Logout")
    return Promise.reject({source: "JWT", message: routerT("common.jwtExpired")})
  }

  if(code != 200) {
    return Promise.reject(response.data);
  }

  return response.data;
}, error => {
  if(error.code === "ECONNABORTED") {
    return Promise.reject({ message: routerT("common.timeout") })
  } else {
    return Promise.reject(error.response.data);
  }
});

export default ajax;
