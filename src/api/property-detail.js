import ajax from "../utils/ajax"
import qs from "qs"

export function listPage(data = {}){
  return ajax({
    method: "post",
    url: "/property/detail/listPage",
    data: data
  })
}

export function add(data = {}){
  return ajax({
    method: "post",
    url: "/property/detail/add",
    data: data
  })
}

export function get(id){
  return ajax({
    method: "get",
    url: `/property/detail/get/${id}`
  })
}

export function update(data = {}){
  return ajax({
    method: "post",
    url: "/property/detail/update",
    data: data
  })
}

export function remove(id){
   return ajax({
    method: "get",
    url: `/property/detail/delete/${id}`
  })
}

export function removejudge(id) {
  return ajax({
    method: "get",
    url: `/property/detail/deleteJudge/${id}`
  });
}