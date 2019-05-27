import ajax from "../utils/ajax"
import qs from "qs"

export function add(data = {}) {
  return ajax({
    method: "post",
    url: "/category/tax/add",
    data: data
  })
}

export function remove(id) {
  return ajax({
    method: "get",
    url: `/category/tax/delete/${id}`
  })
}

export function list(data = {}) {
  return ajax({
    method: "post",
    url: "/category/tax/list",
    data: qs.stringify(data)
  })
}

export function listPage(data = {}) {
  return ajax({
    method: "post",
    url: "/tax/listPage",
    data: data
  })
}

export function listTree() {
  return ajax({
    method: "post",
    url: "/tax/listTree"
  })
}

export function gvtlist(data = {}) {
  return ajax({
    method: "post",
    url: "/category/tax/gvtlist",
    data: qs.stringify(data)
  })
}
