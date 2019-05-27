import GvtLayouts from "../../components/layouts"
import productAttribute from "./product_atrribute"
import productBrand from "./product_brand"
import productCategory from "./product_category"
import productManage from "./product_manage"
import productTax from "./product_tax"
import productVerify from "./product_verify"
import productTenant from './product_tenant'
import productNegative from "./product_negative"
import productImportList from "./product_importList"
const productRouter = {
  path: "/product",
  name: "product",
  component: GvtLayouts,
  children: [
    // 商品管理（商户）
    productTenant,
    // 商品管理(WMS)
    productManage,
    // 商品分类
    productCategory,
    // 商品属性
    productAttribute,
    // 税务管理
    productTax,
    // 品牌管理
    productBrand,
    // 商品审核
    productVerify,
    // 跨境进口清单
    productImportList,
    // 负面清单
    productNegative
  ]
}

export default productRouter
