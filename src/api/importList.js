import ajax from "../utils/ajax"

// 跨境进口商品清单
export function featchProductWhiteList(data){
  return  ajax({
    method:"post",
    url:"/productWhiteList/getPageProductWhiteList",
    data
  })
}

// 导入
export function importProductWhiteList(data){
  return ajax({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method:"post",
    url:"/productWhiteList/importProductWhiteList",
    data
  })
}
// 导出模板
export function downModel(){
  return ajax({
    method:"get",
    url:"/productWhiteList/downModel"
  })
}