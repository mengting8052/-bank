import ajax from "../utils/ajax"

export function listAreaTax(data = {}) {
  return ajax({
    method: "post",
    url: "/tax/listAreaTax",
    data
  })
}

export function list() {
  return ajax({
    method: "post",
    url: "/tax/listTree"
  })
}

export function add(data = {}) {
  return ajax({
    method: 'post',
    url: '/tax/add',
    data: data
  })
}

export function updateStatus(data = {}) {
  return ajax({
    method: "post",
    url: "/tax/updateStatus",
    data
  })
}

export function update(data = {}) {
  return ajax({
    method: 'post',
    url: '/tax/update',
    data: data
  })
}

export function get(data = {}) {
  return ajax({
    method: 'get',
    url: `/tax/get/${data}`
  })
}

export function remove(data = {}) {
  return ajax({
    method: 'get',
    url: `/tax/delete/${data}`
  })
}

// 商品海关税号下拉框数据源
export function hscodeList() {
  return ajax({
    method: "get",
    url: "/hscodes/filter"
  })
}

export function listLocalTax() {
  return ajax({
    method: "post",
    url: "/tax/listLocalTax"
  })
}
