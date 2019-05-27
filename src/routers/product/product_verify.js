import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/product/verify/' + file + '.vue');

const productVerify = {
  path: "verify",
  name: "product-verify",
  redirect: {name: "product-verify-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "product-verify-list",
      component: _import("List"),
      meta: {
        title: routerT("router.product.productVerify.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "product-verify-edit",
      component: _import("Edit"),
      meta: {
        title: routerT("router.product.productVerify.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "product-verify-create",
      component: _import("Create"),
      meta: {
        title: routerT("router.product.productVerify.create"),
        redirect: true
      }
    }
  ]
}

export default productVerify