const lang = {
  defaultEmpty: "不能为空",

  defaultNumber: "只能为数字",

  nameRequired: "品牌名称不能为空",
  sortNumber: "排序值只能为数字",

  taxName: "税则名称不能为空",
  hscode: "海关税号不能为空",

  productBasicInfo: {
    name: "商品名称不能为空",
    shortName: "商品简称不能为空",
    brandId: "商品品牌不能为空",
    classId: "商品分类不能为空",
    ptId: "拆单分类不能为空"
  },

  productBasicUnits: {
    repeatName: "单位名称不能重复",
    repeatModel: "规格不能重复"
  },

  productBsicUnitsItem: {
    name: "单位名称不能为空",
    model: "规格不能为空",
    weight: "重量不能为空, 且最多保留2位小数",
    length: "长度只能为空、0、正整数",
    width: "宽度只能为空、0、正整数",
    height: "高度只能为空、0、正整数"
  },

  itemNo: "商品货号不能为空",

  barcode: "商品条形码不能为空",

  barcodes: "条形码重复"
}

export default { validation: lang }