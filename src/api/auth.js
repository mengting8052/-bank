import ajax from "../utils/ajax"

export function login(data = {}) {
  return ajax({
    method: "post",
    url: "/gmslogin",
    data
  })
}

export function getUserRelateData() {
  return ajax({
    method: "get",
    url: "/ums/auth/getUserRelateData"
  })
}
