const router = {
  path: "importList",
  name: "product-importList",
  redirect: { name: "product-importList-index" },
  component: () => import("../../components/container"),
  children: [
    {
      path: "/",
      name: "product-importList-index",
      component: () => import("../../views/product/importList")
    }
  ]

}

export default router