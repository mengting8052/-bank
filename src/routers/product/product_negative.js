const router = {
  path: "negative",
  name: "product-negative",
  redirect: { name: "product-negative-index" },
  component: () => import("../../components/container"),
  children: [
    {
      path: "/",
      name: "product-negative-index",
      component: () => import("../../views/product/negative")
    }
  ]

}

export default router