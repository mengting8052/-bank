import GvtContainer from "../../components/container"
import ProductCreate from "../../views/product/manage/Create.vue"
import ProductEdit from "../../views/product/manage/Edit.vue"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/product/tenant/' + file + '.vue');

const productTenant = {
  path: "tenant",
  name: "product-tenant",
  redirect: {name: "product-tenant-list"},
  component: GvtContainer,
  children: [
    {
      path: "list",
      name: "product-tenant-list",
      component: _import("List"),
      meta: {
        title: routerT("router.product.productManage.list"),
        redirect: true,
      }
    },
    {
      path: "create",
      name: "product-tenant-create",
      component: ProductCreate,
      meta: {
        title: routerT("router.product.productManage.completeCreate"),
        redirect: true
      }
    },
    {
      path: "edit",
      name: "product-tenant-edit",
      component: ProductEdit,
      meta: {
        title: routerT("router.product.productManage.edit"),
        redirect: true
      }
    },
    {
      path: "fastCreate",
      name: "product-tenant-fastCreate",
      component: _import("FastCreate"),
      meta: {
        title: routerT("router.product.productManage.fastCreate"),
        redirect: true
      },
    },
    {
      path: "batchAdd",
      name: "product-tenant-batchAdd",
      component: _import("batchAdd"),
      meta: {
        title: routerT("router.product.productManage.batchCreate"),
        redirect: true
      },
    }
  ]
}

export default productTenant