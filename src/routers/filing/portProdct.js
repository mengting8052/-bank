import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/filing/portProdct/' + file + '.vue');

const portProdct = {
  path: "portProdct",
  name: "filing-portProdct",
  redirect: {name: "filing-portProdct-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "filing-portProdct-list",
      component: _import("List"),
      meta: {
        title: routerT("router.filing.portProduct.list"),
        redirect: true
      }
    },
  ]
}

export default portProdct