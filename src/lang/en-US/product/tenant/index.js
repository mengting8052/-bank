import fastCreate from "./fastCreate"
import batchAdd from "./batchAdd"
import component from "./component"

const lang = {
  titleQuery: "Product inquiry",
  titleList: "Product list",

  itemNo: "Product Code",
  barCode: "Product barcode",
  name: "product name",
  brand: "product brand",
  category: "Categories",

  image: "image",
  shortName: "Product short name",
  origin: "place of origin",

  ...fastCreate,

  ...batchAdd,

  ...component
}

export default lang