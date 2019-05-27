import Schema from 'async-validator';
import { i18n } from "../setup/i18n-setup"

function defaultRequireValidation(message = i18n.t("validation.defaultEmpty")) {
  return {
    required: true,
    message: message,
    trigger: 'blur'
  }
}

function defaultNumberValidation(message = i18n.t("validation.defaultNumber")) {
  return {
    type: "number",
    message: message,
    trigger: "blur"
  }

}

// 品牌管理校验
export const BRAND_SEARCH_FORM = {
  name: [
    defaultRequireValidation(i18n.t("validation.nameRequired"))
  ],

  sort: [
    defaultNumberValidation(i18n.t("validation.sortNumber"))
  ],
};

//备案税则校验
export const FILINGtAX_SEARCG_FORM = {
  name: [
    defaultRequireValidation(i18n.t("validation.taxName"))
  ],
  hscode: [
    defaultRequireValidation(i18n.t("validation.hscode"))
  ]
};

/**
 * 商品基础信息校验器
 * 
 * name: 商品名称
 * shortName: 商品简称
 * brandId: 商品品牌
 * classId: 商品分类
 * ptId: 拆单分类
 */
export const PRODUCT_BASIC_INFO_VALIDATOR = new Schema({
  name: {
    required: true,
    message: i18n.t("validation.productBasicInfo.name")
  },
  shortName: {
    required: true,
    message: i18n.t("validation.productBasicInfo.shortName")
  },
  brandId: {
    required: true,
    message: i18n.t("validation.productBasicInfo.brandId")
  },
  classId: {
    required: true,
    message: i18n.t("validation.productBasicInfo.classId")
  },
  ptId: {
    required: true,
    message: i18n.t("validation.productBasicInfo.ptId")
  }
});

/**
 * 商品计量单位集合校验器
 * 
 * 判断单位名称不能重复, 规格名称不能重复
 */
export const PRODUCT_BASIC_UNITS_VALIDATOR = new Schema({
  units: {
    type: "array",
    validator(rule, value, callback) {
      const len = value.length;
      let names = value.map(item => item.name.trim());
      names = [...new Set(names)];
      let models = value.map(item => item.model.trim());
      models = [...new Set(models)];
      if(names < len) {
        callback(i18n.t("validation.productBasicUnits.repeatName"));
        return;
      }
      if(models < len) {
        callback(i18n.t("validation.productBasicUnits.repeatModel"));
        return;
      }
      callback();
    }
  }
});

/**
 * 商品计量单位 ITEM 校验器
 * 
 * name: 单位名称
 * model: 规格名称
 * weight: 重量
 */
export const PRODUCT_BASIC_UNITS_ITEM_VALIDATOR = new Schema({
  name: {
    type: "string",
    required: true,
    message: i18n.t("validation.productBsicUnitsItem.name")
  },
  model: {
    required: true,
    type: "string",
    message: i18n.t("validation.productBsicUnitsItem.model")
  },
  weight: {
    required: true,
    pattern: /^[0-9]+([.]\d{1,2})?$/,
    message: i18n.t("validation.productBsicUnitsItem.weight")
  },
  length: {
    validator(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (/^\d+$/.test(value)) {
          callback()
        } else {
          callback(rule.message)
        }
      }
    },
    message: i18n.t("validation.productBsicUnitsItem.length")
  },
  width: {
    validator(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (/^\d+$/.test(value)) {
          callback()
        } else {
          callback(rule.message)
        }
      }
    },
    message: i18n.t("validation.productBsicUnitsItem.width")
  },
  height: {
    validator(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (/^\d+$/.test(value)) {
          callback()
        } else {
          callback(rule.message)
        }
      }
    },
    message: i18n.t("validation.productBsicUnitsItem.height")
  }
});

/**
 * 商品 SKU itemNo 校验器
 * 
 * itemNo 商品货号
 */
export const PRODUCT_SKUS_ITEM_VALIDATOR = new Schema({
  itemNo: {
    required: true,
    message: i18n.t("validation.itemNo")
  }
});

/**
 * 商品 SKU barcode 校验器
 * 
 * barcode 商品条形码
 */
export const PRODUCT_SKUS_BARCODE_VALIDATOR = new Schema({
  barcode: {
    required: true,
    message: i18n.t("validation.barcode")
  }
})

/**
 * 商品 SKU BARCODES 校验器
 * 
 * 在多条码每次保存时, 校验是否存在重复项
 */
export const PRODUCT_SKU_BARCODE_VALIDATOR = new Schema({
  barcodes: {
    type: "array",
    validator(rule, value, callback) {
      const diff = [... new Set(value)];
      if(value.length === diff.length) {
        callback()
      } else {
        callback(rule.message);
      }
    },
    message: i18n.t("validation.barcodes")
  }
})
