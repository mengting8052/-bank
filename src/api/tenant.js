import ajax from '../utils/ajax'
import qs from 'qs'
import {
  SPLITE_DOMAIN
} from "../utils/env";

// 快速新增
export function fastAdd(data = {}) {
  return ajax({
    method: "post",
    url: '/product/fastAdd',
    data
  })
}

// 商户分类列表
export function list(data = {}) {
  return ajax({
    method: 'post',
    url: '/category/property/list',
    data: qs.stringify(data)
  })
}

// 拆单分类
export function splitPackage(data = {}) {
  return ajax({
    baseURL: SPLITE_DOMAIN,
    method: 'post',
    url: '/api/SplitPackage/ProductClass',
    data
  })
}

// 批量新增
export function batchAdd(data = {}) {
  return ajax({
    method: 'post',
    url: '/tenant/product/batchAdd',
    data
  })
}

export function fetchHscode(productId) {
  return ajax({
    method: "post",
    url: "/tenant/product/hscode/list",
    params: {
      productId
    }
  })
}

export function fetchGvtHscode(gvtProductId) {
  return ajax({
    method: "post",
    url: "/tenant/product/hscode/listGvtHscode",
    params: {
      gvtProductId
    }
  })
}

export function fetchUnit(productId) {
  return ajax({
    method: "post",
    url: "/tenant/product/unit/list",
    params: {
      productId
    }
  })
}

export function fetchGvtUnit(gvtProductId) {
  return ajax({
    method: "post",
    url: "/tenant/product/unit/listGvtUnit",
    params: {
      gvtProductId
    }
  })
}

export function fetchGvtSku(gvtProductId) {
  return ajax({
    method: "post",
    url: "/tenant/product/sku/listSku",
    params: {
      gvtProductId
    }
  })
}

export function fetchTax(productId) {
  return ajax({
    method: "post",
    url: "/tenant/tax/listTenantLocalTax",
    params: {
      productId
    }
  })
}
