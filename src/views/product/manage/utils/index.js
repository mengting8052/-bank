import md5 from "js-md5"

const createSkuPropertyId = productObj => {
  let skuProperty = `规格_${productObj.unit_value}_单位_${productObj.unit_label}`
  productObj.productSkuPropertys.map(v => {
    skuProperty += `_${v.propertyName}_${v.propertyDetailName}`
  })

  return md5(skuProperty)
}

export default createSkuPropertyId
