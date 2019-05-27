import ajax from "../utils/ajax"

export function createHscodes(data) {
  return ajax({
    method: "post",
    url: "/hscodes/add",
    data
  })
}

export function fetchAllHscodes(data) {
  return ajax({
    method: "post",
    url: "/hscodes/listPage",
    data
  })
}

export function fetchHscodes(id) {
  return ajax({
    method: "get",
    url: `/hscodes/get/${id}`
  })
}

export function updateHscodes(data = {}) {
  return ajax({
    method: "post",
    url: "/hscodes/update",
    data
  })
}

export function removeHscodes(id) {
  return ajax({
    method: "post",
    url: `/hscodes/delete/${id}`
  })
}

export function listPageHscodesSelect(data = {}) {
  return ajax({
    method: "post",
    url: "/hscodes/listPageHscodesSelect",
    data
  })
}
