import {
  getUserRelateData
} from "../../api/auth"
import Auth from "../../utils/auth"

const user = {
  state: {
    // 用户 ID
    id: "",
    // 用户名
    name: "",
    // 账号
    userName: "",
    // 商户 ID
    tenantId: "",
    // 默认为商户用户
    isTenant: true
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
    },
    IS_NOT_TENANT: (state) => {
      state.isTenant = false;
    },
    LOGOUT_USER: (state) => {
      state.id = "";
      state.name = "";
      state.userName = "";
      state.tenantId = "";
      state.isTenant = true;
      Auth.logOut();
    }
  },

  actions: {

    FetchUserData({ commit }) {
      return new Promise((resolve, reject) => {
        getUserRelateData().then(response => {

          // 用以存储当前的 app
          // 里面包含了菜单数据、权限集合等
          // 将会被 resolve, 并被 permissions module 所用
          var app = true;

          // 接口返回的数据源
          const userinfo = response.data;

          // 当且仅当 tenant && employee 同时为 FALSE 时
          // 当前用户为 "平台用户" (类似商品库的管理员)
          if (!userinfo.tenant && !userinfo.employee) {
            commit("IS_NOT_TENANT");
            // 校验当前 APP 集合中, 是否包含有 code : gms-gvt
            // app = userinfo.apps.find(item => item.code === "gms-gvt");
            // if (!app) {
            //   reject({
            //     source: "action",
            //     redirect: 403,
            //   });
            // } 
          } else {
            // 若 tenant && employee 只要有一个不为 FALSE
            // 当前用户为 "商户用户" (类似商品库的普通用户)
            // 初始化当前用户的 tenantId :
            // tenant.id 或 employee.tenantId
            let tenantId = "";
            if (userinfo.tenant && userinfo.tenant.id) {
              tenantId = userinfo.tenant.id
            } else if (userinfo.employee && userinfo.employee.tenantId) {
              tenantId = userinfo.employee.tenantId
            }

            if (tenantId === "") {
              // tenantId 扔为空, reject error
              reject({
                source: "action",
                redirect: 403,
              });
            } else {
              // tenantId 不为空, mutaition 商户 ID
              commit("SET_TENANT_ID", tenantId);
              // 校验当前 APP 集合中, 是否包含有 code : gms-store
              // app = userinfo.apps.find(item => item.code === "gms-store");
              // if(!app) {
              //   reject({
              //     source: "action",
              //     redirect: 403,
              //   });
              // }
            }
          }

          // 由于 router.beforeEach 钩子函数中, 
          // 当且仅当 app 存在, 并且不为空对象, 才更新其他 state
          if(app && JSON.stringify(app) !== "{}") {
            // mutation 用户 ID
            commit("SET_ID", userinfo.user.id);

            // mutation 用户 名称
            commit("SET_NAME", userinfo.user.name);

            // mutation 账户
            commit("SET_USERNAME", userinfo.user.userName);
          }

          // resolve apps
          resolve(userinfo.apps)
        }).catch(error => {
          reject(error)
        })
      })
    },

    Logout({
      commit
    }) {
      commit("LOGOUT_USER");
    }
  }
}

export default user
