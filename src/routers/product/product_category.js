import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/product/category/' + file + '.vue');

const productCategory = {
  path: "category",
  name: "product-category",
  redirect: {name: "product-category-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "product-category-list",
      component: _import("List"),
      meta: {
        title: routerT("router.product.productCategory.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "product-category-edit",
      component: _import("CreateOrUpdate"),
      meta: {
        title: routerT("router.product.productCategory.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "product-category-create",
      component: _import("CreateOrUpdate"),
      meta: {
        title: routerT("router.product.productCategory.create"),
        redirect: true
      }
    }
  ]
}

export default productCategory