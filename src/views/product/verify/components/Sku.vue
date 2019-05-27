<template>
  <div>
    <sku-property ref="sku-property"></sku-property>

    <sku-rendered></sku-rendered>

    <h2>
      {{$t("product.sku.title")}}
      <Button type="text" @click="generate_sku_table" style="color:#2d8cf0">{{$t("product.sku.confirmCreateSku")}}</Button> 
    </h2>
    <br>

    <sku-table :columns="columns" :data="data"></sku-table>

    <sku-bar-code :visible.sync="visible" :rel-barcode="$relBarcode" @add-rel-barcode="addRelBarcode"></sku-bar-code>

    <sku-img :visible.sync="visibleImg" :sku-image="$skuImage" @add-sku-image="addSkuImage"></sku-img>

    <br>
    <div>
      <Button type="primary" @click="pre">{{$t("product.tabs.pre")}}</Button>
      <Button type="primary" @click="next">{{$t("product.tabs.next")}}</Button>
      <Button type="ghost" @click="$router.go(-1)">{{$t("common.cancel")}}</Button>
    </div>

  </div>
</template>

<script>
import SkuProperty from "./SkuProperty";
import SkuTable from "./SkuTable";
import SkuBarCode from "./SkuBarCode";
import SkuImg from "./SkuImg";
import SkuRendered from "./SkuRendered";
import {
  findComponentUpward,
  findComponentDownward,
  findComponentsDownward,
  descartes
} from "../../../../utils/helper";
import createSkuPropertyId from "../utils";
import { i18n } from "../../../../setup/i18n-setup.js"

export default {
  components: { SkuProperty, SkuTable, SkuBarCode, SkuImg, SkuRendered },

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

  methods: {
    getData() {
      return this.data.map(item => {
        return Object.assign(
          {},
          {
            barcode: item.barcode,
            itemNo: item.itemNo,
            unitName: item.unit_label,
            skuCode: item.skuCode,
            skuImage: item.skuImage,
            relBarcode: item.relBarcode,
            propertyAuditDTOList: item.propertyAuditDTOList.map(v =>
              Object.assign({}, v)
            )
          }
        );
      });
    },

    addRelBarcode(relBarcode) {
      this.data[this.index]["relBarcode"] = relBarcode;
    },

    addSkuImage(skuImage) {
      this.data[this.index]["skuImage"] = skuImage;
    },

    generate_sku_table() {
      this._table_cols();
      this._table_data();
      this.$emit("generate_sku");
    },

    _table_cols() {
      let cols_default_1 = [
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: i18n.t("product.sku.name"),
          key: "name"
        },
        {
          title: i18n.t("product.sku.itemNo"),
          key: "itemNo",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.itemNo
              },
              on: {
                input: val => {
                  params.row.itemNo = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: i18n.t("product.sku.barcode"),
          key: "barcode",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.barcode
              },
              on: {
                input: val => {
                  params.row.barcode = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: i18n.t("product.sku.unit_value"),
          key: "unit_value"
        },
        {
          title: i18n.t("product.sku.unit_label"),
          key: "unit_label"
        }
      ];

      // 根据当前选中属性动态生成
      const childrens = findComponentsDownward(this, "sku-property-item");
      let cols_async = [];
      childrens.map(child => {
        if (child.selected_property.name) {
          cols_async.push({
            title: `${child.selected_property.name}`,
            key: `property_${child.selected_property.id}`
            // width: 250,
          });
        }
      });

      let cols_default_2 = [
        {
          title: i18n.t("product.sku.skuCode"),
          key: "skuCode",
          render: (h, params) => {
            return h("Input", {
              props: {
                type: "text",
                value: params.row.skuCode
              },
              on: {
                input: val => {
                  params.row.skuCode = val;
                  this.data[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: i18n.t("product.sku.relationBarCode"),
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
              i18n.t("product.sku.add")
            );
          }
        },
        {
          title: i18n.t("product.sku.image"),
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
              i18n.t("product.sku.search")
            );
          }
        }
      ];

      this.columns = cols_default_1.concat(cols_async, cols_default_2);
    },

    _table_data() {
      // 商品名称
      const info = this.get_basic_info();
      const name = info.name;
      // 商品计量单位
      const units = this.get_basic_units();
      // 商品属性
      const properties = this.get_sku_property();
      // 融和 商品属性 & 商品计量单位
      let arr = properties;
      arr.push(units);
      // 计量单位 & 商品属性 笛卡尔积
      let skus = descartes(arr);

      let data = [];

      skus.map(item => {
        let obj = {
          // 商品名称
          name: name,
          // 商品货号
          itemNo: "",
          // 商品条形码
          barcode: "",
          // 商品多条形码
          relBarcode: "",
          // 商品图片
          skuImage: item.skuImage || "",
          // 单位名称
          unit_label: "",
          // 规格
          unit_value: "",
          // 需要动态操作的属性, 如: property_${property_id}
          // property_1: "",
          // property_2: "",
          // SKU 编码
          skuCode: "",
          propertyAuditDTOList: []
        };
 
        let skuCode = `${name}_`;
        item.map(v => {
          if (v._mark === "unit") {
            obj.unit_label = v.unit_label;
            obj.unit_value = v.unit_value;
            obj.productUnitName = v.unit_label;
          }
          if (v._mark === "property") {
            obj[`property_${v.property_id}`] = v.name;
            skuCode += `${v.name}_`;
            obj.propertyAuditDTOList.push({ 
              propertyDetailId: v.id,
              propertyDetailName: v.name,
              propertyId: v.property_id,
              propertyName: v.property_name 
            });
          }
        });
        obj.skuCode = skuCode.slice(0, skuCode.lastIndexOf("_"));

        obj["__unique__"] = createSkuPropertyId(obj)
        obj["__found__"] = this.data.find(item => item["__unique__"] === obj["__unique__"]) ? true : false
        
        data.push(obj);
      });

      if(this.data.length) {

        const uniqueData = []
        const notUniqueData = data.filter(item => item["__found__"] === false)

        data.map(item => {
          if(item["__found__"]) {
            const found = this.data.find(v => v["__unique__"] === item["__unique__"])
            uniqueData.push(Object.assign({}, found, {name: item.name, skuCode: item.skuCode}))
          }
        })

        const skuData = Array.from(new Set([...uniqueData, ...notUniqueData]))

        this.data = skuData
      } else {
        this.data = data
      }
    },

    get_sku_property() {
      return this.$refs["sku-property"].getData();
    },

    get_basic_info() {
      const parent = findComponentUpward(this, "product-verify-edit");
      const child = findComponentDownward(parent, "basic-info");
      return child.getData();
    },

    get_basic_units() {
      const parent = findComponentUpward(this, "product-verify-edit");
      const child = findComponentDownward(parent, "basic-unit-id");
      return child.getData();
    },

    pre() {
      this.$emit("pre", "basic");
    },

    next() {
      this.$emit("next", "detail");
    }
  }
};
</script>

