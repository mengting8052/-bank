import GvtContainer from "../../components/container"
import { routerT } from "../../setup/i18n-setup"

const _import = file => () =>
  import ('../../views/filing/filingPort/' + file + '.vue');

const filingPort = {
  path: "filingPort",
  name: "filing-filingPort",
  redirect: {name: "filing-filingPort-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "filing-filingPort-list",
      component: _import("List"),
      meta: {
        title: routerT("router.filing.filingPort.list"),
        redirect: true
      }
    },

    {
      path: "edit",
      name: "filing-filingPort-edit",
      component: _import("Edit"),
      meta: {
        title: routerT("router.filing.filingPort.edit"),
        redirect: true
      }
    },

    {
      path: "create",
      name: "filing-filingPort-create",
      component: _import("Create"),
      meta: {
        title: routerT("router.filing.filingPort.create"),
        redirect: true
      }
    }
  ]
}

export default filingPort