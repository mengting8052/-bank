import GvtLayouts from "../../components/layouts"
import filingPort from "./filingPort"
import filingTax from "./filingTax"
import portProdct from './portProdct'
import Logistics from './Logistics'
import paymentTaxForm from "./paymentTaxForm"
import config from "./config"

const filingRouter = {
  path: "/filing",
  name: "filing",
  component: GvtLayouts,
  children: [
    // 备案口岸
    filingPort,
    // 备案税则
    filingTax,
    //口岸备案商品
    portProdct,
    //物流备案商品
    Logistics,
    // 商品完税表
    paymentTaxForm,
    // 校验配置
    config 
  ]
}

export default filingRouter