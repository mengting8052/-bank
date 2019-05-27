import ajax from "../utils/ajax"
import qs from 'qs'

export function list(data = {}) {
  return ajax({
    method: "post",
    url: "/category/property/list",
    data: qs.stringify(data)
  })
}
