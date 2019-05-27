/**
 * 前端运行 DOMAIN
 * 
 * 在 UMS 还未配置侧边栏菜单数据时
 * 系统会暂时通过 DOMAIN 参数配置侧边栏菜单的跳转链接
 * 
 * 没事不要改它, 不然可能会凉
 * 
 * http://192.168.1.111:8080/#/   测试环境
 * /#/       本地开发
 * 
 * 你可以在下面这个文件中看到它是如何被使用的:
 * 
 * ./src/components/layouts/layouts.vue
 * 
 */
let frontendDomain;
/**
 * 服务端运行 DOMAIN
 * 
 * 通上, 没事不要改它, 除非你知道改完会发生什么 :P
 * 
 * http://192.168.1.225:8070  测试环境
 * http://localhost:8080      本地开发
 * 
 * 不要写成 http://ip:port/, 不要最后的 "/"!!!!!!!!!!
 * 
 * 你可以在下面这个文件中看到它是如何被使用的:
 * 
 * ./src/utils/ajax.js
 * 
 */
let backendDomain;
/**
 * 拆单接口 domain
 * 
 * 由于拆单系统暂未对接 UMS, 导致其服务端无法接收带有 custom request header 的 HTTP REQUEST
 * 因此单独整理出来, 在 axios 中进行 HTTP REQUEST HACK
 * 
 * 你可以在下面这个文件中看到它是如何被使用的:
 * 
 * ./src/utils/ajax.js
 * 
 */
let splitDomain;

switch (process.env.NODE_ENV) {
    // 测试环境
    case "production":
        frontendDomain = "http://192.168.1.136:8080/#/";
        backendDomain = "http://192.168.1.136:8089";
        splitDomain = "http://192.168.1.136:8070";
        break;
    //正式环境
    case "deploy":
        frontendDomain = "http://product.astraea.com.au/#/";
        backendDomain = "http://product.astraea.com.au/api";
        splitDomain = "http://api.split.astraea.com.au";
        break;
    //默认开发环境
    default:
        frontendDomain = "http://localhost:8080/#/";
        backendDomain = "http://192.168.1.136:8089";
        splitDomain = "http://192.168.1.136:8070";
}

export const FRONTEND_DOMAIN = frontendDomain;
export const BACKEND_DOMAIN = backendDomain;
export const SPLITE_DOMAIN = splitDomain;
/**
 * 当前环境
 */
export const ENV = process.env.NODE_ENV;
