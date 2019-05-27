import GvtPage from "./page.vue"

const install = (Vue) => {
  Vue.component('gvt-page', GvtPage)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  GvtPage
}