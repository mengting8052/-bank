import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/filing/filingTax/' + file + '.vue');

const filingTax = {
  path: "filingTax",
  name: "filing-filingTax",
  redirect: {name: "filing-filingTax-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "filing-filingTax-list",
      component: _import("List"),
      meta: {
        title: routerT("router.filing.filingTax.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "filing-filingTax-edit",
      component: _import("CreateOrUpdate"),
      meta: {
        title: routerT("router.filing.filingTax.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "filing-filingTax-create",
      component: _import("CreateOrUpdate"),
      meta: {
        title: routerT("router.filing.filingTax.create"),
        redirect: true
      }
    }
  ]
}

export default filingTax