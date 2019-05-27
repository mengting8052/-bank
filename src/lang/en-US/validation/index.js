const lang = {
  defaultEmpty: "Can not be empty",

  defaultNumber: "Can only be numbers",

  nameRequired: "Brand name cannot be empty",
  sortNumber: "Sort values can only be numbers",

  taxName: "Tax name cannot be empty",
  hscode: "Sea tariff number cannot be empty",

  productBasicInfo: {
    name: "Product name cannot be empty",
    shortName: "Product short name cannot be empty",
    brandId: "Product brand cannot be empty",
    classId: "Product classification cannot be empty",
    ptId: "Split order cannot be empty"
  },

  productBasicUnits: {
    repeatName: "Unit name cannot be repeated",
    repeatModel: "Specifications cannot be repeated"
  },

  productBsicUnitsItem: {
    name: "Unit name cannot be empty",
    model: "Specifications cannot be empty",
    weight: "Weight cannot be empty, and up to 2 decimal places",
    length: "Length can only be empty, 0, positive integer",
    width: "Width can only be empty, 0, positive integer",
    height: "Height can only be empty, 0, positive integer"
  },

  itemNo: "Product number cannot be empty",

  barcode: "Product barcode cannot be empty",

  barcodes: "Bar code repeat"
}

export default { validation: lang }