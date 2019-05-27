import ajax from "../utils/ajax"

export function getPageProductNegativeList(data) {
  return ajax({
    method: "post",
    url: "/productNegativeList/getPageProductNegativeList",
    data
  })
}

export function getPageProductList(data) {
  return ajax({
    method: "post",
    url: "/productNegativeList/getPageProductList",
    data
  })
}

export function save(data) {
  return ajax({
    method: "post",
    url: "/productNegativeList/save",
    data
  })
}

export function deleteById(id) {
  return ajax({
    method: "delete",
    url: `/productNegativeList/deleteById/${id}`,
  })
}