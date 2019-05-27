import iviewZH from "iview/dist/locale/zh-CN"
import router from "./router"
import components from "./components"
import validation from "./validation"
import filing from "./filing"
import product from "./product"

const lang = {
  ...iviewZH,

  common: {
    // 过期
    jwtExpired: "登录过期, 请重新登录!",

    timeout: "请求超时",

    // 分页
    pagination: "{pageSize} 条/页",

    // 查询 操作按钮
    search: "查询",
    reset: "重置",

    // CURD 操作按钮
    create: "新建",
    batchCreate: "批量新增",
    remove: "删除",
    edit: "修改",
    save: "保存",

    // 模态框
    cancel: "取消",
    confirm: "确定",
    choose: "选中",
    confirmAndChoose: "选中并关闭",

    // message 提示
    success: "操作成功",

    // 其他
    operate: "操作",
    createUser: "创建人",
    createTime: "创建时间",
    modifyUser: "更新人",
    modifyTime: "更新时间",

    notify: "提示",
    removeNotice: "<p>此操作将永久删除该数据, 是否继续?</p>"
  },

  ...router,
  
  ...components,

  ...validation,

  ...filing,

  ...product
}

export default lang