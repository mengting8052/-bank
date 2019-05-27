import ajax from "../utils/ajax"

export function listPage(data = {}) {
  return ajax({
    method: "post",
    url: "/goodsTaxRate/listPage",
    data
  })
}

export function fetchAllTaxRate(data = {}) {
  return ajax({
    method: "post",
    url: "/goodsTaxRate/list",
    data
  })
}

export function importTaxRate(data = {}) {
  return ajax({
    method: "post",
    url: "/goodsTaxRate/importGoodsTaxRate",
    data
  })
}

export function getTaxRateByTaxNum(taxNum) {
  return ajax({
    method: "get",
    url: `/goodsTaxRate/getGoodsTaxRateByTaxNum/${taxNum}`
  })
}