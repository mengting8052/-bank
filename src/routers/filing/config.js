const router = {
  path: "config",
  name: "config",
  redirect: { name: "config-index" },
  component: () => import("../../components/container"),
  children: [
    {
      path: "/",
      name: "config-index",
      component: () => import("../../views/filing/config")
    }
  ]
}

export default router