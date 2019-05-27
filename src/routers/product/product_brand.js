import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/product/brand/' + file + '.vue');

const productBrand = {
  path: "brand",
  name: "product-brand",
  redirect: {name: "product-brand-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "product-brand-list",
      component: _import("List"),
      meta: {
        title: routerT("router.product.productBrand.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "product-brand-edit",
      component: _import("Edit"),
      meta: {
        title: routerT("router.product.productBrand.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "product-brand-create",
      component: _import("Create"),
      meta: {
        title: routerT("router.product.productBrand.create"),
        redirect: true
      }
    }
  ]
}

export default productBrand