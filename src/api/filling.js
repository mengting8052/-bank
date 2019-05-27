import ajax from '../utils/ajax'
import qs from 'qs'
export function listPage(data={}){
    return ajax({
        method:'post',
        url:'/filingPort/listPage',
        data
    })
}
export function region(data={}){
return ajax({
    method:'get',
    url:'/common/region',
    data
})
}
export function add(data={}){
    return ajax({
        method:'post',
        url:'/filingPort/add',
        data
    })
}
export function remove(data={}){
    return ajax({
      method:'post',
      url:`/filingPort/delete/${data}`,
      data:data
    })
  }
  export function update(data={}){
    return ajax({
        method:'post',
        url:'/filingPort/update',
        data
    })
  }