import ajax from '../utils/ajax'
import qs from 'qs'

export function listPageProductSku(data={}){
    return ajax({
        method:'post',
        url:'/product/listPageProductSku',
        data:data
    })
}