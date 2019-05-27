const getters = {
  user: state => state.user,
  permissions : state => state.permission.permissions,
  menus: state => state.permission.menus,
  logo: state => state.permission.logo
}

export default getters
