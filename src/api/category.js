import ajax from "../utils/ajax"

export function gvtListTree() {
  return ajax({
    method: "get",
    url: "/category/gvtListTree"
  });
}

export function listTree() {
  return ajax({
    method: "post",
    url: "/category/listTree"
  })
}

export function listAllTree() {
  return ajax({
    method: "post",
    url: "/category/listAllTree"
  })
}

export function addFirst(data = {}) {
  return ajax({
    method: "post",
    url: "/category/addFirst",
    data: data
  })
}

export function remove(id) {
  return ajax({
    method: "get",
    url: `/category/delete/${id}`
  })
}

export function getFirst(id) {
  return ajax({
    method: "get",
    url: `/category/getFirst/${id}`
  })
}

export function updateFirst(data = {}) {
  return ajax({
    method: "post",
    url: "/category/updateFirst",
    data: data
  })
}

export function addSecond(data = {}) {
  return ajax({
    method: "post",
    url: "/category/addSecond",
    data
  })
}

export function listPage(data = {}) {
  return ajax({
    method: "post",
    url: "/category/listPage",
    data: data
  })
}

export function getSecond(id) {
  return ajax({
    method: "get",
    url: `/category/getSecond/${id}`
  })
}

export function updateSecond(data = {}){
  return ajax({
    method: "post",
    url: "/category/updateSecond",
    data
  })
}

export function getSecondHscode(categoryId) {
  return ajax({
    method: "post",
    url: `/category/hscode/list?categoryId=${categoryId}`
  })
}

export function getSecondProperty(categoryId) {
  return ajax({
    method: "post",
    url: `/category/property/list?categoryId=${categoryId}`
  })
}

export function listTreeForTenantLeadIn(data = {}) {
  return ajax({
    method: "post",
    url: "/category/listTreeForTenantLeadIn",
    data
  })
}