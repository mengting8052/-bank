import ajax from '../utils/ajax'
import qs from 'qs'

export function listPage(data={}){
    return ajax({
        method:'post',
        url:'/portProduct/listPage',
        data
    })
}
export function add(data={}){
    return ajax({
      method:'post',
      url:'/portProduct/add',
      data
    })
  }

  export function update(data={}){
    return ajax({
      method:'post',
      url:'/portProduct/update',
      data
    })
  }
  export function remove(data={}){
    return ajax({
      method:'post',
      url:`/portProduct/delete/${data}`,
      data:data
    })
  }
//   备案税则
  export function taxRecord(){
      return ajax({
          method:'get',
          url:`/hscodes/filter`,
    
      })

  }
//   币制
  export function currency(){
      return ajax({
          method:'get',
          url:"/common/currency",
      })
  }
//   备案口岸列表
  export function customs(data={}){
      return ajax({
          method:'post',
          url:'/filingPort/filter',
          data
      })
  }
