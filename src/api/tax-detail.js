import ajax from '../utils/ajax'
    
export function listPage(data = {}){
    return ajax({
      method: "post",
      url: "/tax/listPage",
      data: data
    })  
  }