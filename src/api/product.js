import ajax from "../utils/ajax"

export function listPage(data = {}) {
  return ajax({
    method: "post",
    url: "/product/listPage",
    data
  })
}

export function addOrUpdate(data = {}) {
  return ajax({
    method: "post",
    url: "/product/save",
    data
  })
}

export function leadIn(data = {}) {
  return ajax({
    method: "post",
    url: "/product/leadIn",
    data
  })
}

export function get(id) {
  return ajax({
    method: "get",
    url: `/product/get/${id}`
  })
}

export function gvtGet(id) {
  return ajax({
    method: "get",
    url: `/product/gvtGet/${id}`
  });
}

export function gvtListPage(data = {}) {
  return ajax({
    method: "post",
    url: "/product/gvtListPageProductSku",
    data
  })
}

export function batchAdd(data = []) {
  return ajax({
    method: "post",
    url: "/product/batchAdd",
    data
  })
}

export function gvtListPageForBatch(data = {}) {
  return ajax({
    method: "post",
    url: "/product/gvtListPageForBatch",
    data
  })
}

export function fetchUnitList(productId) {
  return ajax({
    method: "post",
    url: `/product/unit/list?productId=${productId}`
  })
}

export function fetchTaxListByCategoryId(categoryId) {
  return ajax({
    method: "post",
    url: "/category/tax/list",
    params: { categoryId }
  })
}

export function fetchHsCodeListByCategoryId(categoryId) {
  return ajax({
    method: "post",
    url: "/category/hscode/list",
    params: { categoryId }
  })
}

export function fetchHsCodeList(productId) {
  return ajax({
    method: "post",
    url: "/product/hscode/list",
    params: {
      productId
    }
  })
}

export function fetchSkuList(productId) {
  return ajax({
    method: "post",
    url: "/product/sku/list",
    params: { productId }
  })
}
