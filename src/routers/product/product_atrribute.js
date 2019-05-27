import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/product/attribute/' + file + '.vue');

const productAttribute = {
  path: "attribute",
  name: "product-attribute",
  redirect: {name: "product-attribute-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "product-attribute-list",
      component: _import("List"),
      meta: {
        title: routerT("router.product.productAttribute.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "product-attribute-edit",
      component: _import("Edit"),
      meta: {
        title: routerT("router.product.productAttribute.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "product-attribute-create",
      component: _import("Create"),
      meta: {
        title: routerT("router.product.productAttribute.create"),
        redirect: true
      }
    }
  ]
}

export default productAttribute