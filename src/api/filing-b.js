
import ajax from '../utils/ajax'
    
export function listPage(data = {}){
    return ajax({
      method: "post",
      url: "/hscodes/listPage",
      data
    })  
  }
  export function add(data={}){
    return ajax({
      method:'post',
      url:'/hscodes/add',
      data
    })
  }

  export function update(data={}){
    return ajax({
      method:'post',
      url:'/hscodes/update',
      data
    })
  }
  export function remove(data={}){
    return ajax({
      method:'post',
      url:`/hscodes/delete/${data}`,
      data:data
    })
  }