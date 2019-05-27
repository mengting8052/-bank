import iviewEN from "iview/dist/locale/en-US"
import router from "./router"
import components from "./components"
import validation from "./validation"
import filing from "./filing"
import product from "./product"

const lang = {
  ...iviewEN,

  common: {
    // 过期
    jwtExpired: "Login expired, please log in again!",

    timeout: "Request timed out",

    // 分页
    pagination: "{pageSize} Page/piece",

    // 查询 操作按钮
    search: "Query",
    reset: "Reset",

    // CURD 操作按钮
    create: "Create",
    batchCreate: "Batch Create",
    remove: "Remove",
    edit: "Edit",
    save: "Save",

    // 模态框
    cancel: "Cancel",
    confirm: "OK",
    choose: "Selected",
    confirmAndChoose: "Selected And Close",

    // message 提示
    success: "Successfuly",

    // 其他
    operate: "operation",
    createUser: "create user",
    createTime: "create time",
    modifyUser: "modify user",
    modifyTime: "modify time",

    notify: "Notice",
    removeNotice: "<p>This action will permanently delete the data. Do you want to continue?</p>"
  },

  ...router,
  
  ...components,

  ...validation,

  ...filing,

  ...product
}

export default lang
