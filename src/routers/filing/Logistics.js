import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/filing/Logistics/' + file + '.vue');

const Logistics = {
  path: "Logistics",
  name: "filing-Logistics",
  redirect: {name: "filing-Logistics-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "filing-Logistics-list",
      component: _import("List"),
      meta: {
        title: routerT("router.filing.logisticsProduct.list"),
        redirect: true
      }
    },
  ]
}

export default Logistics