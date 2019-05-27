import fastCreate from "./fastCreate"
import batchAdd from "./batchAdd"
import component from "./component"

const lang = {
  titleQuery: "商品查询",
  titleList: "商品列表",

  itemNo: "商品货号",
  barCode: "商品条形码",
  name: "商品名称",
  brand: "商品品牌",
  category: "商品分类",

  image: "图片",
  shortName: "商品简称",
  origin: "原产地",

  ...fastCreate,

  ...batchAdd,

  ...component
}

export default lang