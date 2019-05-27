import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/filing/paymentTaxForm/' + file + '.vue');

const routers = {
  path: "paymentTaxForm",
  name: "filing-payment-tax-form",
  redirect: {name: "filing-payment-tax-form-index"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "filing-payment-tax-form-index",
      component: _import("Index"),
      meta: {
        title: routerT("router.filing.paymentTaxForm.list"),
        redirect: true
      }
    },
  ]
}

export default routers