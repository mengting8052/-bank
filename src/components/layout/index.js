import GvtLayout from "./layout.vue"
import GvtLayoutTree from "./layout-tree.vue"

const install = Vue => {
  Vue.component('gvt-layout', GvtLayout)
  Vue.component('gvt-layout-tree', GvtLayoutTree)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  GvtLayout,
  GvtLayoutTree
}
