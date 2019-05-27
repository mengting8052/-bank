import ajax from "../utils/ajax"
import qs from "qs"

/**
 * 
 * 奇怪为什么会单独声明这个常量?
 * 
 * productAudit 这个单词太难拼了, 只想写一次
 * 
 */
const prefix = "productAudit";

export function productAuditList(data = {}) {
  return ajax({
    method: "post",
    url: `/${prefix}/${prefix}List`,
    data
  });
}

export function productAuditDetailInfo(data = {}) {
  return ajax({
    method: "post",
    url: `/${prefix}/${prefix}DetailInfo`,
    data: qs.stringify(data)
  })
}

export function productAuditSkuInfo(data = {}) {
  return ajax({
    method: "post",
    url: `/${prefix}/${prefix}SkuInfo`,
    data: qs.stringify(data)
  })
}

export function productAudit(data = {}) {
  return ajax({
    method: "post",
    url: `/${prefix}/${prefix}`,
    data
  })
}

export function productAuditReject(id) {
  return ajax({
    method: "post",
    url: `/${prefix}/${prefix}Reject/`+ id
  });
}

export function tenantAuditList() {
  return ajax({
    method: "post",
    url: `/${prefix}/listTenant`
  });
}