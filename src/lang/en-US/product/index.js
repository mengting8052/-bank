import tax from "./tax"
import brand from "./brand"
import attribute from "./attribute"
import category from "./category"
import manage from "./manage"
import verify from "./verify"
import tenant from "./tenant"
import negative from "./negative"
import importList from "./importList"

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
      basic: "Product information",
      sku: "Product sku",
      detail: "Product detail",
      pre: "Previous",
      next: "Next step",
      pass: "Pass",
      refuse: "Refuse"
    },

    basicAlias: {
      title: "Product alias",
      error: "Alias input up to 500 characters"
    },

    basicInfo: {
      title: "basic information",

      name: "product name",
      shortName: "Product short name",
      brandId: "product brand",
      category: "Categories",
      split: "Split single classification",
      origin: "place of origin",
      componentContent: "Ingredient content",
      image: "product picture",

      brandNeedToCreate: "No such brand, please go to the new!",
      categoryNeedToCreate: "Without this category, please go to the new one!"
    },

    basicUnitId: {
      title: "unit of measurement",
      addUnit: "Increase unit of measure",

      remark: "unit of measurement",
      basicRemark: "basic unit",
      helpRemark: "Auxiliary unit",
      name: "unit name",
      rate: "Conversion rate",
      model: "specification",
      weight: "weight(g)",
      length: "length(mm)",
      width: "width(mm)",
      height: "height(mm)",
    },

    basicTax: {
      title: "Tax rate information",
      localTitle: "Local circulation",
      nation: "country",
      province: "area",
      shortName: "Abbreviation",
      name: "Full name",
      rate: "tax rate"
    },

    basicRate: {
      title: "Tax rate information (cross-border)",
      addRate: "Increase tax rules",
      nation: "country",
      province: "area",
      gvtCode: "GVT CODE",
      hscode: "HSCODE",
      rate: "tax rate",
      removeNotice: "<p>This action will delete the tax rate information associated with this category. Do you want to continue?</p>"
    },

    basicRateModal: {
      title: "Select tax information",
      nation: "country",
      area: "area",
      gvtCode: "GVT CODE",
      hscode: "HSCODE",
      name: "Tariff name"
    },

    sku: {
      title: "Generate SKU",
      confirmCreateSku: "Confirm generation",
      errorProperty: "Please tick the attribute",

      name: "Product name",
      itemNo: "Product code",
      barcode: "Product barcode",
      unit_value: "specification",
      unit_label: "unit",
      skuCode: "SKU Code",
      relationBarCode: "Multiple barcodes",
      add: "Add",
      image: "Images",
      search: "View",
      minSalesPrice: "Minimum sale price",
      gvtBarcode: "Gvt Barcode",

      errorSku: "Please Generate SKU",
    },

    skuBarCode: {
      title: "Add barcode",

      add: "Add",
      addSkuBarCode: "Add barcode",

      repeatBarCodeWithSelf: "Multiple barcodes cannot be repeated",
      repeatBarCodeWithProduct: "Multiple barcodes and product barcodes cannot be repeated",
      repeatBarCodeWithOthers: "Multiple barcodes cannot be repeated with other multiple barcodes"
    },

    skuImg: {
      image: "images"
    },

    skuImgItem: {
      notice: "Product head map"
    },

    skuProperty: {
      title: "Property settings"
    },

    skuPropertyItem: {
      checkAll: "select all",
      add: "Add {name}"
    },

    skuRendered: {
      productName: "product name",
      itemNo: "Product Code",
      gvtBarcode: "GVT SKU",
      barcode: "Product barcode",
      unit_value: "specification",
      unit_label: "unit",
      skuCode: "SKU barcode",
      relationBarCode: "Multiple barcodes",
      search: "View",
      image: "images",
      minSalesPrice: "Minimum sale price"
    },

    skuRenderedTable: {
      title: "reference SKU"
    },

    skuTable: {
      noDataText: "Please generate a current SKU combination based on the reference SKU"
    },

    categoryTaxModal: {
      title: "Select tax information",
      nation: "country",
      province: "area",
      code: "code",
      name: "Tax name",
      remark: "remark"
    },

    productImage: {
      title: "images"
    }

  }
}