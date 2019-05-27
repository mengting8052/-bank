import ajax from '../utils/ajax'
import qs from 'qs'

export function listPage(data={}){
    return ajax({
        method:'post',
        url:'/logisticsGoods/listPage',
        data
    })
};
//物流公司列表
export function logisticsList(data={}){
    return ajax({
        method:'get',
        url:'/common/logistic',
        data
    })
}
export function remove(id){
 return ajax({
     method:'post',
     url:`/logisticsGoods/delete/${id}`,
 })
}

export function add(data={}){
    return ajax({
        method:'post',
        url:'/logisticsGoods/add',
        data
    })
}
export function update(data={}){
  return ajax({
      method:'post',
      url:'/logisticsGoods/update',
      data
  })
}