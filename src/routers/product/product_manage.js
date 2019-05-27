import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/product/manage/' + file + '.vue');

const productMange = {
  path: "manage",
  name: "product-manage",
  redirect: {name: "product-manage-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "product-manage-list",
      component: _import("List"),
      meta: {
        title: routerT("router.product.productManage.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "product-manage-edit",
      component: _import("Edit"),
      meta: {
        title: routerT("router.product.productManage.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "product-manage-create",
      component: _import("Create"),
      meta: {
        title: routerT("router.product.productManage.create"),
        redirect: true
      }
    },{
      path:"batchAdd",
      name:"product-manage-batchAdd",
      component:_import("batchAdd"),
      meta:{
        title: routerT("router.product.productManage.batchCreate"),
        redirect:true
      }
    }
  ]
}

export default productMange