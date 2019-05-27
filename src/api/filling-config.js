import ajax from "../utils/ajax"

export function saveOrUpdate(data) {
  return ajax({
    method: "post",
    url: "/config/saveOrUpdate",
    data
  })
}

export function selectById(id = 1) {
  return ajax({
    method: "get",
    url: `/config/selectById/${id}`
  })
}