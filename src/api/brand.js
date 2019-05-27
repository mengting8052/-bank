import ajax from "../utils/ajax"

// 获取品牌列表
export function listPage(data = {}) {
  return ajax({
    method: "post",
    url: "/brand/listPage",
    data: data
  })
}

export function add(data = {}) {
  return ajax({
    method: "post",
    url: "/brand/add",
    data: data
  })
}

export function update(data = {}) {
  return ajax({
    method: "post",
    url: "/brand/update",
    data:data
  })
}
export function remove(data) {
  return ajax({
    methods: 'get',
    url: '/brand/delete/' + data,
    data
  })
}

export function list(data = {}) {
  return ajax({
    method: "post",
    url: "/brand/list",
    data: data
  });
}

export function gvtList(data = {}) {
  return ajax({
    method: "post",
    url: "/brand/gvtList",
    data
  }) 
}
