import GvtContainer from "../../components/container"

const _import = file => () =>
  import ('../../views/product/tax/' + file + '.vue');

const productTax = {
  path: "tax",
  name: "product-tax",
  redirect: {name: "product-tax-list"},
  component: GvtContainer,
  children: [
    {
      path: "/",
      name: "product-tax-list",
      component: _import("List")
    }
  ]
}

export default productTax