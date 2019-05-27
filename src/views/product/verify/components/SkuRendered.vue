<template>
  <div style="margin: 10px 0">
    <sku-rendered-table :columns="columns" :data="data"></sku-rendered-table>

    <sku-bar-code :visible.sync="visible" :rel-barcode="$relBarcode" dis-edit></sku-bar-code>

    <sku-img :visible.sync="visibleImg" :sku-image="$skuImage" dis-edit></sku-img>
  </div>
</template>

<script>
import SkuRenderedTable from "./SkuRenderedTable";
import SkuBarCode from "./SkuBarCode";
import SkuImg from "./SkuImg";
import { mapGetters } from "vuex";
import { deepCopy } from "../../../../utils/helper";
import { productAuditSkuInfo } from "../../../../api/productAudit";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  components: { SkuRenderedTable, SkuBarCode, SkuImg },

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

  created() {
    const id = this.$route.query.id;
    productAuditSkuInfo({ id }).then(response => {
      this.columns = this._init_sku_table_cols(response.data);
      this.data = this._init_sku_table_data(response.data);
    });
  },

  methods: {
    _init_sku_table_data(params) {
      const data = params.map(item => {
        let obj = {
          // 商品名称
          productName: item.productName,
          // 商品货号
          itemNo: item.itemNo,
          // 商品条形码
          barcode: item.barcode,
          // 商品多条形码
          relBarcode: item.relBarcode,
          // 商品图片
          skuImage: item.skuImage || "",
          // 单位名称
          unitName: item.unitName,
          // 规格
          model: item.model,
          // SKU 编码
          skuCode: item.skuCode,
          propertyAuditDTOList: []
        };
        item.tenantProductAuditSkuPropertyVOList.map(v => {
          obj[`property_${v.propertyName}`] = v.propertyDetailName;
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
          key: "itemNo",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                readonly: true,
                value: params.row.itemNo
              }
            });
          }
        },
        {
          title: i18n.t("product.skuRendered.barcode"),
          key: "barcode",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                readonly: true,
                value: params.row.barcode
              }
            });
          }
        },
        {
          title: i18n.t("product.skuRendered.unit_value"),
          key: "model"
        },
        {
          title: i18n.t("product.skuRendered.unit_label"),
          key: "unitName"
        }
      ];

      // 随便取一个 sku list 中的对象即可
      let cols_async = [];
      if (
        data &&
        data.length > 0 &&
        data[0]["tenantProductAuditSkuPropertyVOList"] &&
        data[0]["tenantProductAuditSkuPropertyVOList"][0]
      ) {
        data[0]["tenantProductAuditSkuPropertyVOList"].map(item => {
          cols_async.push({
            title: item.propertyName,
            key: `property_${item.propertyName}`
          });
        })
      }

      let cols_default_2 = [
        {
          title: i18n.t("product.skuRendered.skuCode"),
          key: "skuCode",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                readonly: true,
                value: params.row.skuCode
              }
            });
          }
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
              i18n.t("product.skuRendered.search") 
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
              i18n.t("product.skuRendered.search") 
            );
          }
        }
      ];

      const cols = cols_default_1.concat(cols_async, cols_default_2);

      return cols;
    }
  }
};
</script>

