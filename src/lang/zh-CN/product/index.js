import tax from "./tax"
import brand from "./brand"
import attribute from "./attribute"
import category from "./category"
import manage from "./manage"
import verify from "./verify"
import tenant from "./tenant"
import importList from "./importList"
import negative from "./negative"

export default {
  product: {
    tax,
    brand,
    attribute,
    category,
    manage,
    verify,
    tenant,
    importList,
    negative,
    // 商品模型
    tabs: {
      basic: "商品信息",
      sku: "商品SKU",
      detail: "商品详情",
      pre: "上一步",
      next: "下一步",
      pass: "通过",
      refuse: "不通过"
    },

    basicAlias: {
      title: "商品别名",
      error: "别名至多输入500个字符"
    },

    basicInfo: {
      title: "基础信息",

      name: "商品名称",
      shortName: "商品简称",
      brandId: "商品品牌",
      category: "商品分类",
      split: "拆单分类",
      origin: "原产地",
      componentContent: "成分含量",
      image: "商品图片",

      brandNeedToCreate: "没有该品牌, 请前往新增!",
      categoryNeedToCreate: "没有该分类, 请前往新增!"
    },

    basicUnitId: {
      title: "计量单位",
      addUnit: "增加计量单位",

      remark: "计量单位",
      basicRemark: "基本单位",
      helpRemark: "辅助单位",
      name: "单位名称",
      rate: "换算率",
      model: "规格",
      weight: "重量(g)",
      length: "长(mm)",
      width: "宽(mm)",
      height: "高(mm)",
    },

    basicTax: {
      title: "税率信息",
      localTitle: "本地流通",
      nation: "国家",
      province: "地区",
      shortName: "简称",
      name: "全称",
      rate: "税率"
    },

    basicRate: {
      title: "税率信息（跨境）",
      addRate: "增加税则",
      nation: "国家",
      province: "地区",
      gvtCode: "GVT编码",
      hscode: "HS编码",
      rate: "税率",
      removeNotice: "<p>此操作将删除该分类所关联的税率信息, 是否继续?</p>"
    },

    basicRateModal: {
      title: "选择税务信息",
      nation: "国家",
      area: "地区",
      gvtCode: "GVT编码",
      hscode: "HS编码",
      name: "税则名称"
    },

    sku: {
      title: "生成 SKU",
      confirmCreateSku: "确认生成",
      errorProperty: "请勾选属性",

      name: "商品名称",
      itemNo: "商品货号",
      barcode: "商品条形码",
      unit_value: "规格",
      unit_label: "单位",
      skuCode: "SKU 编码",
      relationBarCode: "多条码",
      add: "添加",
      image: "商品图片",
      search: "查看",
      minSalesPrice: "最低销售价",
      gvtBarcode: "琼景SKU",

      errorSku: "请生成 SKU",
    },

    skuBarCode: {
      title: "添加条形码",

      add: "添加",
      addSkuBarCode: "添加条形码",

      repeatBarCodeWithSelf: "多条码不能重复",
      repeatBarCodeWithProduct: "多条码与商品条形码不能重复",
      repeatBarCodeWithOthers: "多条码与其他多条码不能重复"
    },

    skuImg: {
      image: "商品图片"
    },

    skuImgItem: {
      notice: "商品头图"
    },

    skuProperty: {
      title: "属性设置"
    },

    skuPropertyItem: {
      checkAll: "全选",
      add: "新增 {name}"
    },

    skuRendered: {
      productName: "商品名称",
      itemNo: "商品货号",
      gvtBarcode: "琼景SKU",
      barcode: "商品条形码",
      unit_value: "规格",
      unit_label: "单位",
      skuCode: "SKU 编码",
      relationBarCode: "多条码",
      search: "查看",
      image: "商品图片",
      minSalesPrice: "最低销售价"
    },

    skuRenderedTable: {
      title: "参考 SKU"
    },

    skuTable: {
      noDataText: "请依据参考SKU生成当前的SKU组合"
    },

    categoryTaxModal: {
      title: "选择税务信息",
      nation: "国家",
      province: "地区",
      code: "编码",
      name: "税种名称",
      remark: "备注"
    },

    productImage: {
      title: "商品图片"
    }

  }
}