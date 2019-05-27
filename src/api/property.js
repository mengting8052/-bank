import ajax from "../utils/ajax"
import qs from "qs"

export function list() {
  return ajax({
    method: "post",
    url: "/property/list"
  })
}

export function add(data = {}) {
  return ajax({
    method: "post",
    url: "/property/add",
    data: data
  })
}

export function removejudge(id) {
  return ajax({
    method: "get",
    url: `/property/deleteJudge/${id}`
  });
}

export function remove(id) {
  return ajax({
    method: "get",
    url: `/property/delete/${id}`
  })
}

export function update(data = {}) {
  return ajax({
    method: "post",
    url: "/property/update",
    data: data
  })
}

export function get(id) {
  return ajax({
    method: "get",
    url: `/property/get/${id}`
  })
}

export function listPageSelected(data = {}) {
  return ajax({
    method: "post",
    url: "/property/listPageSelected",
    data: data
  })
}

export function listPropertyByClass(data = {}) {
  return ajax({
    method: "post",
    url: "/property/listPropertyByClass",
    data: qs.stringify(data)
  })
}

export function listPropertyByClassName(data = {}) {
  return ajax({
    method: "post",
    url: "/property/listPropertyByClassName",
    data: qs.stringify(data)
  })
}
