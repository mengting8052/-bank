<template>
  <div style="margin: 10px 0">
    <sku-rendered-table :columns="columns" :data="data"></sku-rendered-table>

    <sku-bar-code
      :visible.sync="visible"
      :rel-barcode="$relBarcode"
      @add-rel-barcode="addRelBarcode"
      read-only
    ></sku-bar-code>

    <sku-img
      :visible.sync="visibleImg"
      :sku-image="$skuImage"
      @add-sku-image="addSkuImage"
      read-only
    ></sku-img>
  </div>
</template>

<script>
import SkuRenderedTable from "./SkuRenderedTable";
import SkuBarCode from "./SkuBarCode";
import SkuImg from "./SkuImg";
import { mapGetters } from "vuex";
import { deepCopy } from "../../../../../utils/helper";
import { i18n } from "../../../../../setup/i18n-setup.js"

export default {
  components: { SkuRenderedTable, SkuBarCode, SkuImg },

  props: {
    initSku: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      columns: [],
      data: [],
      visible: false,
      visibleImg: false,
      index: -1
    };
  },

  computed: {
    ...mapGetters(["user"]),

    $relBarcode() {
      if (this.index > -1 && this.data[this.index].relBarcode) {
        return this.data[this.index].relBarcode;
      } else {
        return "";
      }
    },

    $skuImage() {
      if (this.index > -1 && this.data[this.index].skuImage) {
        return this.data[this.index].skuImage;
      } else {
        return "";
      }
    }
  },

  watch: {
    initSku(val) {
      this.columns = this._init_sku_table_cols(deepCopy(val));
      this.data = this._init_sku_table_data(deepCopy(val));
    }
  },

  methods: {
    addRelBarcode(relBarcode) {
      this.data[this.index]["relBarcode"] = relBarcode;
    },

    addSkuImage(skuImage) {
      this.data[this.index]["skuImage"] = skuImage;
    },

    _init_sku_table_data(params) {
      const data = params.map(item => {
        let obj = {
          id: item.id,
          gvtBarCode: item.gvtBarCode,
          // 商品名称
          productName: item.productName,
          gvtBarcode: item.gvtBarcode,
          // 商品货号
          itemNo: item.itemNo,
          // 商品条形码
          barcode: item.barcode,
          // 商品多条形码
          relBarcode: item.relBarcode,
          // 商品图片
          skuImage: item.skuImage || "",
          // 单位名称
          unit_label: item.unitName,
          productUnitName: item.unitName,
          // 规格
          unit_value: item.model,
          // SKU 编码
          skuCode: item.skuCode,
          skuPropertyDTOList: []
        };
        if (this.user.isTenant) {
          obj.minSalesPrice = item.minSalesPrice || 0;
        }
        item.productSkuPropertys.map(v => {
          obj[`property_${v.propertyId}`] = v.propertyDetailName;
          obj.skuPropertyDTOList.push(Object.assign({}, v));
        });
        return obj;
      });
      return data;
    },

    _init_sku_table_cols(data) {
      let cols_default_1 = [
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: i18n.t("product.skuRendered.productName"),
          key: "productName"
        },
        {
          title: i18n.t("product.skuRendered.itemNo"),
          key: "itemNo"
        },
        {
          title: i18n.t("product.skuRendered.gvtBarcode"),
          key: "gvtBarcode"
        },
        {
          title: i18n.t("product.skuRendered.barcode"),
          key: "barcode"
        },
        {
          title: i18n.t("product.skuRendered.unit_value"),
          key: "unit_value"
        },
        {
          title: i18n.t("product.skuRendered.unit_label"),
          key: "unit_label"
        }
      ];

      let cols_async = [];
      data[0]["productSkuPropertys"].map(item => {
        cols_async.push({
          title: item.propertyName,
          key: `property_${item.propertyId}`
        });
      });

      let cols_default_2 = [
        {
          title: i18n.t("product.skuRendered.skuCode"),
          key: "skuCode"
        },
        {
          title: i18n.t("product.skuRendered.relationBarCode"),
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text"
                },
                class: ["edit-btn"],
                on: {
                  click: () => {
                    this.index = params.index;
                    this.visible = true;
                  }
                }
              },
              i18n.t("product.skuRendered.search"),
            );
          }
        },
        {
          title: i18n.t("product.skuRendered.image"),
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text"
                },
                class: ["edit-btn"],
                on: {
                  click: () => {
                    this.index = params.index;
                    this.visibleImg = true;
                  }
                }
              },
              i18n.t("product.skuRendered.search"),
            );
          }
        }
      ];

      if (this.user.isTenant) {
        cols_default_2.splice(1, 0, {
          title: i18n.t("product.skuRendered.minSalesPrice"),
          key: "minSalesPrice"
        });
      }

      const cols = cols_default_1.concat(cols_async, cols_default_2);

      return cols;
    }
  }
};
</script>

